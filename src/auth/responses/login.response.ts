import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
    @ApiProperty({ description: 'accessToken', nullable: false })
    accessToken: string;
}
