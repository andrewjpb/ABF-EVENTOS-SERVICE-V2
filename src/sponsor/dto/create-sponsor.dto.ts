import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateSponsorDto {
    @IsString({ message: 'the field "name" must be in string format' })
    @IsNotEmpty({ message: 'the field "name" must be informed' })
    name: string;

    @IsString({ message: 'the field "image_url" must be in string format' })
    image_url: string;

    @IsString({ message: 'the field "thumb_url" must be in string format' })
    thumb_url: string;

    @IsArray({ message: 'the field events must be an array' })
    events: Event[];

    @IsString({ message: 'the field "description" must be in string format' })
    @IsNotEmpty({ message: 'the field "description" must be informed' })
    description: string;
}
