import { JwtPayload } from '@auth/interfaces';
import { CurrentUser, Roles } from '@common/decorators';
import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Put,
    UseInterceptors,
    Post,
    UseGuards,
    HttpStatus,
    Patch,
    ParseIntPipe,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { UserData, UserResponse } from './responses';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { RolesGuard } from '@auth/guargs/role.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryParamsDto } from '@common/dto';
import { ApiPagination } from '@common/decorators/api-pagination.decorator';

@ApiBearerAuth('JWT-auth')
@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':idOrEmail')
    @UseInterceptors(ClassSerializerInterceptor)
    // @ApiPagination()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: UserData,
    })
    async findOneUser(@Param('idOrEmail') idOrEmail: string) {
        const user = await this.userService.findOne(idOrEmail);
        return new UserData(user);
    }

    @UsePipes(new ValidationPipe({ transform: true }))
    @Get()
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiOperation({ summary: 'ПОлучение списка всех пользователей (доступно только под админ учёткой)' })
    @ApiPagination()
    @ApiQuery({ name: 'roles', required: false, enum: Role, isArray: true, description: 'Roles query' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: UserResponse,
    })
    async findAllUser(@CurrentUser() user: JwtPayload, @Query() queryParams: QueryParamsDto): Promise<UserResponse> {
        const users = await this.userService.findAll(user, queryParams);
        return users;
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Удаление пользователя по id' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        // type: [UserResponse],
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string' },
            },
        },
    })
    async deleteUser(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
        return this.userService.delete(id, user);
    }

    @Patch(':id')
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Изменение пользователя (доступно только под админ учёткой)' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: UpdateUserDto,
    })
    async updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() body: Partial<UpdateUserDto>) {
        const user = await this.userService.updateUser(id, body);
        return new UserData(user);
    }
}
