import { Order, OrderStatus, OrderType } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class OrderResponse implements Order {
    id: number;
    address: string;
    phone: string;
    name: string;
    orderStatus: OrderStatus;

    @Exclude()
    userId;

    @Exclude()
    orderType: OrderType;

    createdAt: Date;
    updatedAt: Date;

    constructor(order: Order) {
        Object.assign(this, order);
    }
}
