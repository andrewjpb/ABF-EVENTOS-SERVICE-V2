import { PartialType } from '@nestjs/swagger';
import { CreateSpeakerDto } from './create-speaker.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSpeakerDto extends PartialType(CreateSpeakerDto) {
    @IsOptional()
    @IsString({ message: 'o campo "image_path" precisa ser valido' })
    image_path: string;

    @IsOptional()
    @IsString({ message: 'o campo "thumb_path" precisa ser valido' })
    thumb_path: string;
}
