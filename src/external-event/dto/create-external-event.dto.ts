import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateExternalEventDto {
    @IsString({ message: 'o campo "title" precisa ser valido' })
    @IsNotEmpty({ message: 'o campo "title" deve ser informado' })
    title: string;

    @IsString({ message: 'o campo "description" precisa ser valido' })
    @IsNotEmpty({ message: 'o campo "description" deve ser informado' })
    description: string;

    @IsDateString()
    date: string;

    @IsString({ message: 'o campo "event_link" precisa ser valido' })
    event_link: string;

    @IsOptional()
    image_url: string;

    @IsOptional()
    thumb_url: string;

    @IsBoolean()
    highlight: boolean;
}
