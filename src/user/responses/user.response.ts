import { ApiProperty } from '@nestjs/swagger';
import { Provider, Role, User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

export class UserResponse implements User {
    @IsUUID()
    @IsString()
    @ApiProperty({ description: 'user id', nullable: false })
    id: string;

    @IsString()
    @ApiProperty({ description: 'user email', nullable: false })
    email: string;

    @Exclude()
    password: string;

    @Exclude()
    @ApiProperty({ description: 'user provider', nullable: true, enum: Provider })
    provider: Provider | null;

    @Exclude()
    @ApiProperty({ description: 'user createdAt', nullable: false })
    createdAt: Date;

    @ApiProperty({ description: 'user updatedAt', nullable: false })
    updatedAt: Date;

    @ApiProperty({ description: 'user roles', nullable: false, enum: Role, isArray: true })
    roles: Role[];

    @Exclude()
    @ApiProperty({ description: 'user isBlocked', nullable: false })
    isBlocked: boolean;

    constructor(user: User) {
        Object.assign(this, user);
    }

    // constructor(user?: User) {
    //     if (user) {
    //         Object.assign(this, user);
    //     }
    // }
}
