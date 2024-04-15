import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class PaginationParamsDto {
    @Type(() => Number)
    @IsOptional()
    @IsInt({ message: 'Offset deve ser um número inteiro.' })
    offset: number;

    @Type(() => Number)
    @IsOptional()
    @IsInt({ message: 'Size deve ser um número inteiro.' })
    size: number;

    @IsOptional()
    @IsString({ message: 'Contains deve ser uma string.' })
    contains?: string;
}
