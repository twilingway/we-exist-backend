import { ApiProperty } from '@nestjs/swagger';
import { Order, OrderStatus, OrderType } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { ArrayNotEmpty, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateOrderDto implements Order {
    @ApiProperty({ description: 'Order userId', nullable: true, required: false })
    userId: string;
    @Exclude()
    createdAt: Date;
    @Exclude()
    updatedAt: Date;
    @Exclude()
    id: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Order address', nullable: false, required: false })
    address: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Order phone mask 79510993468', nullable: false, required: false })
    @Matches(/^7\d{10}$/, { message: 'Неверный формат номера телефона: маска 79510993468' })
    phone: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Order name', nullable: true, required: false })
    name: string | null;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Order description', nullable: true, required: false })
    description: string;

    @IsOptional()
    @ApiProperty({ description: 'Order type', nullable: false, enum: OrderType, required: false })
    orderType: OrderType;

    @IsOptional()
    @ApiProperty({ description: 'Order type', nullable: false, enum: OrderStatus, required: false })
    orderStatus: OrderStatus;
}
