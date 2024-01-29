import { ApiProperty } from '@nestjs/swagger';
import { Provider, Role, User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

export class UpdateUserDto implements User {
    @IsUUID()
    @IsString()
    id: string;

    @Exclude()
    @IsString()
    // @ApiProperty({ description: 'user email', nullable: false })
    email: string;

    @Exclude()
    password: string;

    // @Exclude()
    createdAt: Date;

    // @Exclude()
    provider: Provider;

    // @Exclude()
    @ApiProperty({ description: 'user isBlocked', nullable: false })
    isBlocked: boolean;

    updatedAt: Date;

    @ApiProperty({ description: 'user roles', nullable: false, enum: Role, isArray: true })
    roles: Role[];

    // constructor(user: User) {
    //     Object.assign(this, user);
    // }
}
