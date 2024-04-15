import { IsArray, IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { EventTypeEnum } from '../enum/event-type.enum';

export class CreateEventDto {
    @IsString({ message: 'o campo "title" precisa ser valido' })
    @IsNotEmpty({ message: 'o campo "title" deve ser informado' })
    title: string;

    @IsString({ message: 'o campo "image_url" precisa ser valido' })
    image_url: string;

    @IsString({ message: 'o campo "thumb_url" precisa ser valido' })
    thumb_url: string;

    @IsString({ message: 'o campo "summary" precisa ser valido' })
    @IsNotEmpty({ message: 'o campo "summary" deve ser informado' })
    summary: string;

    @IsString({ message: 'o campo "description" precisa ser valido' })
    @IsNotEmpty({ message: 'o campo "description" deve ser informado' })
    description: string;

    @IsOptional()
    @IsString({ message: 'o campo "transmission_link" precisa ser valido' })
    @IsNotEmpty({ message: 'o campo "transmission_link" deve ser informado' })
    transmission_link: string;

    @IsOptional()
    @IsString({ message: 'o campo "schedule_link" precisa ser valido' })
    schedule_link: string;

    @IsOptional()
    @IsString({ message: 'o campo "ticket_img_path" precisa ser valido' })
    @IsNotEmpty({ message: 'o campo "ticket_img_path" deve ser informado' })
    ticket_img_path: string;

    @IsDateString()
    date: string;

    @IsNumber()
    vacancy_total: number;

    @IsNumber()
    vacancies_per_brand: number;

    @IsNumber()
    minimum_quorum: number;

    @IsBoolean()
    highlight: boolean;

    @IsString({ message: 'o campo "cover_photo_url" precisa ser valido' })
    @IsNotEmpty({ message: 'o campo "cover_photo_url" deve ser informado' })
    format: EventTypeEnum;

    @IsString({ message: 'o campo "start_time" precisa ser valido' })
    @IsNotEmpty({ message: 'o campo "start_time" deve ser informado' })
    start_time: string;

    @IsString({ message: 'o campo "end_time" precisa ser valido' })
    @IsNotEmpty({ message: 'o campo "end_time" deve ser informado' })
    end_time: string;

    @IsArray({ message: 'o campo "users" deve ser um array' })
    users: string[];

    @IsArray({ message: 'o campo "speakers" deve ser um array' })
    speakers: string[];

    @IsArray({ message: 'o campo "sponsors" deve ser um array' })
    sponsors: string[];

    @IsArray({ message: 'o campo "supporters" deve ser um array' })
    supporters: string[];

    @IsString({ message: 'o campo "addressId" precisa ser valido' })
    @IsNotEmpty({ message: 'o campo "addressId" deve ser informado' })
    addressId: string;

    @IsBoolean()
    free_online: boolean;
}
