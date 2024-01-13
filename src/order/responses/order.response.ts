import { AggregateRoot } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import { Order, OrderStatus, OrderType } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class OrderResponse implements Order {
    id: number;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(OrderStatus)
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