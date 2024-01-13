import { JwtPayload } from '@auth/interfaces';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Order, OrderStatus, Role } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';

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
                return null;
            });

        return savedOrder;
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

    async delete(id: number, user: JwtPayload) {
        if (!user.roles.includes(Role.ADMIN) || !user.roles.includes(Role.MANAGER)) {
            throw new ForbiddenException();
        }

        return this.prismaService.order.delete({ where: { id }, select: { id: true } }).catch((error) => {
            this.logger.error(error);
            return null;
        });
    }
}