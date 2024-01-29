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
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserResponse } from './responses';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { RolesGuard } from '@auth/guargs/role.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiBearerAuth('JWT-auth')
@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}
    // @Post()
    // createUser(@Body() dto) {
    //     return this.userService.save(dto);
    // }

    @Get(':idOrEmail')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: [UserResponse],
    })
    async findOneUser(@Param('idOrEmail') idOrEmail: string) {
        const user = await this.userService.findOne(idOrEmail);
        return new UserResponse(user);
    }

    @Get()
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    // @UseInterceptors(ClassSerializerInterceptor)
    @ApiOperation({ summary: 'ПОлучение списка всех пользователей (доступно только под админ учёткой)' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: [UserResponse],
        // schema: {
        //     type: 'array',
        //     items: { $ref: getSchemaPath(UserResponse) },
        // },
    })
    async findAllUser(@CurrentUser() user: JwtPayload): Promise<UserResponse[]> {
        const users = await this.userService.findAll(user);
        return users.map((user) => new UserResponse(user));
    }

    @Delete(':id')
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
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
            // items: { $ref: getSchemaPath(UserResponse) },
        },
    })
    async deleteUser(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
        return this.userService.delete(id, user);
    }

    // @Get()
    // me(@CurrentUser() user: JwtPayload) {
    //     return user;
    // }

    // @UseInterceptors(ClassSerializerInterceptor)
    // @Put()
    // async updateUser(@Body() body: Partial<User>) {
    //     const user = await this.userService.save(body);
    //     return new UserResponse(user);
    // }

    @Patch(':id')
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @ApiOperation({ summary: 'Изменение пользователя (доступно только под админ учёткой)' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: UpdateUserDto,
        // schema: {
        //     type: 'array',
        //     items: { $ref: getSchemaPath(UserResponse) },
        // },
    })
    async updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() body: Partial<UpdateUserDto>) {
        const user = await this.userService.updateUser(id, body);
        return new UserResponse(user);
    }
}
