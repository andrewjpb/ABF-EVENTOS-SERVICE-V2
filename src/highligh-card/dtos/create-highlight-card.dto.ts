import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateHighlightCardDto {
    @IsString({ message: 'the field "title" must be in string format' })
    title: string;

    @IsOptional()
    @IsString({ message: 'the field "image_url" must be in string format' })
    image_url: string;

    @IsOptional()
    @IsString({ message: 'the field "external_link" must be in string format' })
    external_link: string;

    @IsOptional()
    @IsBoolean({ message: 'the field "active" must be a boolean' })
    active: boolean;
}
