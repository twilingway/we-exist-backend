import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResponse } from './responses';
import { Order } from '@prisma/client';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':phone')
    async findOneUser(@Param('phone') phone: string) {
        const orders = await this.orderService.findAllByPhone(phone);
        return orders;
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Post()
    async updateUser(@Body() body: Partial<Order>) {
        const order = await this.orderService.createOrder(body);
        return new OrderResponse(order);
    }
}
