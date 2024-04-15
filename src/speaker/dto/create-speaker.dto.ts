import { IsArray, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateSpeakerDto {
    @IsString({ message: 'the field "name" must be in string format' })
    @IsNotEmpty({ message: 'the field "name" must be informed' })
    name: string;

    @IsString({ message: 'the field "image_url" must be in string format' })
    image_url: string;

    @IsString({ message: 'the field "thumb_url" must be in string format' })
    thumb_url: string;

    @IsArray({ message: 'the field events must be an array' })
    events: Event[];
}
