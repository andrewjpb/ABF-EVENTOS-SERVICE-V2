import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsString({ message: 'o campo "image_path" precisa ser valido' })
    image_path: string;

    @IsOptional()
    @IsString({ message: 'o campo "thumb_path" precisa ser valido' })
    thumb_path: string;
}
