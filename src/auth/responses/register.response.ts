import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RegisterResponse {
    @ApiProperty({ description: 'id', nullable: false })
    id: string;
    @ApiProperty({ description: 'email', nullable: false })
    email: string;
    @ApiProperty({ description: 'updatedAt', nullable: false })
    updatedAt: Date;
    @ApiProperty({ description: 'roles', nullable: false, enum: Role, isArray: true })
    roles: Role[];
}
