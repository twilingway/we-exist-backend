import { Provider, Role, User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

export class UserResponse implements User {
    @IsUUID()
    @IsString()
    id: string;

    @IsString()
    email: string;

    @Exclude()
    password: string;

    @Exclude()
    createdAt: Date;

    @Exclude()
    provider: Provider;

    @Exclude()
    isBlocked: boolean;

    updatedAt: Date;
    roles: Role[];

    constructor(user: User) {
        Object.assign(this, user);
    }
}
