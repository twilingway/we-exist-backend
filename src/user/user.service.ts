import { JwtPayload } from '@auth/interfaces';
import { convertToSecondsUtil } from '@common/utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ForbiddenException, HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role, User } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { genSaltSync, hashSync } from 'bcrypt';
import { Cache } from 'cache-manager';
import { UpdateOrderDto } from 'src/order/dto/update-order.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { extractErrorMessage } from '@common/utils/extract-error-message.util';
import { QueryParamsDto } from '@common/dto';
import { UserData, UserResponse } from './responses';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    constructor(
        private readonly prismaService: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly configService: ConfigService,
    ) {}

    async save(user: Partial<User>) {
        const hashedPassword = user?.password ? this.hashPassword(user.password) : null;
        const savedUser = await this.prismaService.user.upsert({
            where: {
                email: user.email,
            },
            update: {
                password: hashedPassword ?? undefined,
                provider: user?.provider ?? undefined,
                roles: user?.roles ?? undefined,
                isBlocked: user?.isBlocked ?? undefined,
            },
            create: {
                email: user.email,
                password: hashedPassword,
                provider: user?.provider,
                roles: user.email === this.configService.get('ADMIN_EMAIL') ? ['ADMIN'] : ['USER'],
            },
        });
        await this.cacheManager.set(savedUser.id, savedUser);
        await this.cacheManager.set(savedUser.email, savedUser);
        return savedUser;
    }

    async updateUser(id: string, user: Partial<UpdateUserDto>) {
        const updateUser = await this.prismaService.user
            .update({
                where: {
                    id: id,
                },
                data: {
                    // email: order.email ?? undefined,
                    roles: user?.roles ?? undefined,
                    isBlocked: user?.isBlocked ?? undefined,
                },
            })
            .catch((error) => {
                this.logger.error(error);
                if (error instanceof PrismaClientValidationError) {
                    // Извлекаем сообщение об ошибке
                    const errorMessage = extractErrorMessage(error.message);

                    throw new HttpException(`Ошибка валидации данных: ${errorMessage}`, HttpStatus.BAD_REQUEST);
                }
                if (error instanceof PrismaClientKnownRequestError) {
                    // Проверяем код ошибки Prisma
                    if (error.code === 'P2025') {
                        // Запись с таким id не найдена
                        throw new HttpException(`Error: Запись с таким ID не найдена.`, HttpStatus.BAD_REQUEST);
                    } else {
                        // Другие ошибки Prisma
                        console.error('Произошла ошибка при обновлении ордера:', error);
                    }
                } else {
                    // Неизвестные ошибки
                    console.error('Неизвестная ошибка:', error);
                }
                throw new HttpException('Внутренняя ошибка сервера', HttpStatus.INTERNAL_SERVER_ERROR);
            });
        if (updateUser) {
            await Promise.all([this.cacheManager.del(id), this.cacheManager.del(user.email)]);
        }
        return updateUser;
    }

    async findOne(idOrEmail: string, isReset = false) {
        if (isReset) {
            await this.cacheManager.del(idOrEmail);
        }
        const user = await this.cacheManager.get<User>(idOrEmail);

        if (!user) {
            const user = await this.prismaService.user.findFirst({
                where: {
                    OR: [{ id: idOrEmail }, { email: idOrEmail }],
                },
            });
            if (!user) {
                return null;
            }

            await this.cacheManager.set(idOrEmail, user, convertToSecondsUtil(this.configService.get('JWT_EXP')));

            return user;
        }

        return user;
    }

    async findAll(user: JwtPayload, queryParams: QueryParamsDto): Promise<UserResponse> {
        const { page = 1, limit = 10, search, roles } = queryParams;
        let where = {};
        const searchConditions = [];
        if (search) {
            searchConditions.push({ email: { contains: search, mode: 'insensitive' } });
        }

        if (roles && roles.length > 0) {
            searchConditions.push({
                roles: {
                    hasEvery: Array.isArray(roles) ? roles : [roles], // Или используйте другой подход в зависимости от вашего случая
                },
            });
        }

        if (searchConditions.length) {
            where = { OR: searchConditions };
        }

        if (user.roles.includes(Role.ADMIN)) {
            const [data, total] = await Promise.all([
                this.prismaService.user
                    .findMany({
                        where,
                        skip: (page - 1) * limit,
                        take: limit,
                        // ...другие параметры выборки
                        orderBy: { id: 'desc' },
                    })
                    .catch((error) => {
                        this.logger.error(error);
                        return null;
                    }),
                ,
                this.prismaService.user.count({ where }), // Подсчитывает общее количество записей
            ]);

            return {
                total,
                data: data.map((d) => new UserData(d)),
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };
        }
    }

    async delete(id: string, user: JwtPayload) {
        if (user.id !== id && !user.roles.includes(Role.ADMIN)) {
            throw new ForbiddenException();
        }
        await Promise.all([this.cacheManager.del(id), this.cacheManager.del(user.email)]);
        return this.prismaService.user.delete({ where: { id }, select: { id: true } });
    }

    private hashPassword(password: string) {
        return hashSync(password, genSaltSync(10));
    }
}
