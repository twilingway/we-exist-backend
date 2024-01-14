import { Public } from '@common/decorators';
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
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { OrderResponse } from './responses';

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
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Success',
        type: OrderResponse,
        // schema: {
        //     type: 'object',
        //     properties: {
        //         stringValue: { type: 'string' },
        //         dateValue: { type: 'string', format: 'date-time' },
        //         intValue: { type: 'integer' },
        //         floatValue: { type: 'number', format: 'float' },
        //         booleanValue: { type: 'boolean' },
        //         arrayValue: { type: 'array', items: { type: 'string' } },
        //         objectValue: {
        //             type: 'object',
        //             properties: {
        //                 innerProperty: { type: 'number' },
        //             },
        //         },
        //     },
        // },
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 400 },
                message: { type: 'array', example: ['Ошибка валидации данных: Argument `phone` is missing.'] },
                error: { type: 'string', example: 'Bad Request' },
            },
            required: ['statusCode', 'message'],
        },
    })
    @Post()
    async createOrder(@Body() body: CreateOrderDto) {
        const order = await this.orderService.createOrder(body);
        return new OrderResponse(order);
    }
}
