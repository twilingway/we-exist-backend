import { ApiProperty } from '@nestjs/swagger';
import { Order, OrderStatus, OrderType } from '@prisma/client';
import { UserData } from '@user/responses';
import { Exclude } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class OrderData implements Order {
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

    // @Exclude()
    @ApiProperty({ description: 'Order userId', nullable: false })
    userId: string;

    @IsString()
    @ApiProperty({ description: 'Order description', nullable: true, required: false })
    description: string | null;

    @IsEnum(OrderStatus)
    @ApiProperty({ description: 'Order status', nullable: false, enum: OrderStatus })
    orderStatus: OrderStatus;

    @IsEnum(OrderType)
    @ApiProperty({ description: 'Order orderType', nullable: false, enum: OrderType })
    orderType: OrderType;

    @ApiProperty({ description: 'Order createdAt', nullable: false })
    createdAt: Date;

    @ApiProperty({ description: 'Order updatedAt', nullable: false })
    updatedAt: Date;
    @ApiProperty({ description: 'Order user', nullable: true })
    user: UserData | null;

    constructor(order?: Order) {
        if (order) {
            Object.assign(this, order);
        }
    }
}

export class OrderResponse {
    @ApiProperty({ description: 'order total', nullable: false })
    total: number;
    @ApiProperty({ type: [OrderData], description: 'order data', nullable: false })
    data: OrderData[];
    @ApiProperty({ description: 'order page', nullable: false })
    page: number;
    @ApiProperty({ description: 'order limit', nullable: false })
    limit: number;
    @ApiProperty({ description: 'order totalPages', nullable: false })
    totalPages: number;
}
