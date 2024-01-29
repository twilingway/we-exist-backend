import { IsPasswordsMatchingConstraint } from '@common/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ description: 'user email', nullable: false })
    email: string;

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    @ApiProperty({ description: 'user password', nullable: false })
    password: string;

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    @ApiProperty({ description: 'user repeat password', nullable: false })
    @Validate(IsPasswordsMatchingConstraint)
    passwordRepeat: string;
}
