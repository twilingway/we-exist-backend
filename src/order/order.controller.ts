import { CurrentUser, Public, Roles } from '@common/decorators';
import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    UseInterceptors,
    ParseIntPipe,
    UseGuards,
    Put,
    Patch,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiSecurity,
    ApiTags,
    getSchemaPath,
} from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { OrderData, OrderResponse } from './responses';
import { JwtPayload } from '@auth/interfaces';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@auth/guargs/role.guard';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiPagination } from '@common/decorators/api-pagination.decorator';
import { QueryParamsDto } from '@common/dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    @Roles('ADMIN' || 'MANAGER')
    @UseGuards(RolesGuard)
    @ApiBearerAuth('JWT-auth')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiPagination()
    @ApiOperation({ summary: 'Получение всех заявок' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: OrderResponse,
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    async findAllOrders(@CurrentUser() user: JwtPayload, @Query() queryParams: QueryParamsDto) {
        const orders = await this.orderService.findAll(user, queryParams);
        return orders;
    }

    @Get(':phone')
    @Public()
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiOperation({ summary: 'Получение всех заявок по номеру телефона' })
    @ApiParam({ name: 'phone', required: true, description: 'phone mask 79510993468' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: OrderResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    async findOneUser(@Param('phone') phone: string) {
        const orders = await this.orderService.findAllByPhone(phone);
        return orders;
    }

    @Post()
    @Public()
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiOperation({ summary: 'Создание заявки из мобильного приложения' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Success',
        type: OrderResponse,
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
    async createOrder(@Body() body: CreateOrderDto) {
        const order = await this.orderService.createOrder(body);
        return new OrderData(order);
    }

    @Delete(':id')
    @Roles('ADMIN' || 'MANAGER')
    @UseGuards(RolesGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Удаление заявки по id' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    async deleteOrder(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
        const order = await this.orderService.delete(id, user);
        return new OrderData(order);
    }

    @Roles('ADMIN' || 'MANAGER')
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(RolesGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Обновление заявки' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: OrderResponse,
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
    @Patch(':id')
    async updateOrder(
        @Param('id', ParseIntPipe) id: number,
        // @Body() body: Partial<CreateOrderDto>,
        @Body() body: UpdateOrderDto,
        @CurrentUser() user: JwtPayload,
    ) {
        const order = await this.orderService.updateOrder(id, body, user);
        return new OrderData(order);
    }
}
