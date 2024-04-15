import { PartialType } from '@nestjs/swagger';
import { CreateSponsorDto } from './create-sponsor.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSponsorDto extends PartialType(CreateSponsorDto) {
    @IsOptional()
    @IsString({ message: 'o campo "image_path" precisa ser valido' })
    image_path: string;

    @IsOptional()
    @IsString({ message: 'o campo "thumb_path" precisa ser valido' })
    thumb_path: string;
}
