import { JwtPayload } from '@auth/interfaces';
import { ForbiddenException, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Order, OrderStatus, Role } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { PrismaService } from '@prisma/prisma.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { extractErrorMessage } from '@common/utils/extract-error-message.util';

@Injectable()
export class OrderService {
    private readonly logger = new Logger(OrderService.name);
    constructor(
        private readonly prismaService: PrismaService,
        // @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly configService: ConfigService,
    ) {}

    async createOrder(order: Partial<Order>) {
        const savedOrder = await this.prismaService.order
            .create({
                data: {
                    address: order.address ?? undefined,
                    phone: order.phone ?? undefined,
                    orderType: order.orderType ?? undefined,
                    orderStatus: OrderStatus.NEW,
                    name: order?.name ?? undefined,
                },
            })
            .catch((error) => {
                this.logger.error(error);
                if (error instanceof PrismaClientValidationError) {
                    // Извлекаем сообщение об ошибке
                    const errorMessage = extractErrorMessage(error.message);

                    throw new HttpException(`Ошибка валидации данных: ${errorMessage}`, HttpStatus.BAD_REQUEST);
                }
                throw new HttpException('Внутренняя ошибка сервера', HttpStatus.INTERNAL_SERVER_ERROR);
            });

        return savedOrder;
    }

    async updateOrder(id: number, order: Partial<UpdateOrderDto>, user: JwtPayload) {
        if (user.roles.includes(Role.ADMIN) || user.roles.includes(Role.MANAGER)) {
            const updateOrder = await this.prismaService.order
                .update({
                    where: {
                        id: id,
                    },
                    data: {
                        address: order?.address ?? undefined,
                        phone: order.phone ?? undefined,
                        name: order?.name ?? undefined,
                        description: order?.description ?? undefined,
                        orderType: order.orderType ?? undefined,
                        orderStatus: order.orderStatus ?? undefined,
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

            return updateOrder;
        }
        throw new ForbiddenException();
    }

    async findAllByPhone(phone: string): Promise<Order[]> {
        const orders = await this.prismaService.order
            .findMany({
                where: {
                    phone,
                    orderStatus: {
                        not: 'DELETED',
                    },
                },
                orderBy: { id: 'desc' },
            })
            .catch((error) => {
                this.logger.error(error);
                return null;
            });

        return orders;
    }

    async findAll(user: JwtPayload): Promise<Order[]> {
        if (user.roles.includes(Role.ADMIN) || user.roles.includes(Role.MANAGER)) {
            const orders = await this.prismaService.order
                .findMany({
                    orderBy: { id: 'desc' },
                })
                .catch((error) => {
                    this.logger.error(error);
                    return null;
                });

            return orders;
        }
        throw new ForbiddenException();
    }

    async delete(id: number, user: JwtPayload) {
        if (user.roles.includes(Role.ADMIN) || user.roles.includes(Role.MANAGER)) {
            return this.prismaService.order.delete({ where: { id }, select: { id: true } }).catch((error) => {
                this.logger.error(error);
                return null;
            });
        }
        throw new ForbiddenException();
    }
}
