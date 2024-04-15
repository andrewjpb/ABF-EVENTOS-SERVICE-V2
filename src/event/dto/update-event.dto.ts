import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateEventDto extends PartialType(CreateEventDto) {
    @IsOptional()
    @IsString({ message: 'o campo "image_path" precisa ser valido' })
    image_path: string;

    @IsOptional()
    @IsString({ message: 'o campo "thumb_path" precisa ser valido' })
    thumb_path: string;
}
