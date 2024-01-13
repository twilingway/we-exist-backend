import { ApiProperty } from '@nestjs/swagger';
import { Order, OrderStatus, OrderType } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto implements Order {
    @Exclude()
    userId: string;
    @Exclude()
    orderStatus: OrderStatus;
    @Exclude()
    createdAt: Date;
    @Exclude()
    updatedAt: Date;
    @Exclude()
    id: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Order address', nullable: false })
    address: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Order phone mask 79510993468', nullable: false })
    phone: string;

    @IsString()
    @ApiProperty({ description: 'Order name', nullable: true, required: false })
    name: string | null;

    @ApiProperty({ description: 'Order type', nullable: false, enum: OrderType })
    orderType: OrderType;
}
