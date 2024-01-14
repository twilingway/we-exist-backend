import { ApiProperty } from '@nestjs/swagger';
import { Order, OrderStatus, OrderType } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class OrderResponse implements Order {
    @ApiProperty({ description: 'Order id', nullable: false })
    id: number;

    @ApiProperty({ description: 'Order address', nullable: false })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({ description: 'Order phone', nullable: false })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @ApiProperty({ description: 'Order name', nullable: true, required: false })
    name: string | null;

    @ApiProperty({ description: 'Order name', nullable: false, enum: OrderStatus })
    orderStatus: OrderStatus;

    @Exclude()
    userId: string;

    @Exclude()
    orderType: OrderType;

    @ApiProperty({ description: 'Order createdAt', nullable: false })
    createdAt: Date;

    @ApiProperty({ description: 'Order updatedAt', nullable: false })
    updatedAt: Date;

    constructor(order?: Order) {
        if (order) {
            Object.assign(this, order);
        }
    }
}
