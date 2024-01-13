import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    UseInterceptors,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResponse } from './responses';
import { Order } from '@prisma/client';
import { Public } from '@common/decorators';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}
    @Public()
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiOperation({ summary: 'Получение всех заявок по номеру телефона' })
    @ApiParam({ name: 'phone', required: true, description: 'phone mask 79510993468' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    @Get(':phone')
    async findOneUser(@Param('phone') phone: string) {
        const orders = await this.orderService.findAllByPhone(phone);
        return orders;
    }

    @Public()
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiOperation({ summary: 'Создание заявки из мобильного приложения' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    @Post()
    async createOrder(@Body() body: CreateOrderDto) {
        const order = await this.orderService.createOrder(body);
        return new OrderResponse(order);
    }
}
