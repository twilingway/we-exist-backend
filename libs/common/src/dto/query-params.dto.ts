import { Role } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsString, Min, IsArray, IsEnum } from 'class-validator';

export class QueryParamsDto {
    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    @Min(1)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(Role, { each: true })
    roles?: Role | Role[];
}
