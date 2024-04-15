import { PartialType } from '@nestjs/swagger';
import { CreateSupporterDto } from './create-supporter.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSupporterDto extends PartialType(CreateSupporterDto) {
    @IsOptional()
    @IsString({ message: 'o campo "image_path" precisa ser valido' })
    image_path: string;

    @IsOptional()
    @IsString({ message: 'o campo "thumb_path" precisa ser valido' })
    thumb_path: string;
}
