/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateEventAttendeeDto {
    @IsUUID('4', { message: 'o campo "eventId" precisa ser um UUID válido' })
    @IsNotEmpty({ message: 'o campo "eventId" deve ser informado' })
    eventId: string;

    @IsString({ message: 'o campo "attendee_full_name" precisa ser válido' })
    @IsNotEmpty({ message: 'o campo "attendee_full_name" deve ser informado' })
    attendee_full_name: string;

    @IsString({ message: 'o campo "attendee_email" precisa ser válido' })
    @IsNotEmpty({ message: 'o campo "attendee_email" deve ser informado' })
    attendee_email: string;

    @IsString({ message: 'o campo "attendee_position" precisa ser válido' })
    @IsNotEmpty({ message: 'o campo "attendee_position" deve ser informado' })
    attendee_position: string;

    @IsString({ message: 'o campo "attendee_rg" precisa ser válido' })
    @IsNotEmpty({ message: 'o campo "attendee_rg" deve ser informado' })
    attendee_rg: string;

    @IsString({ message: 'o campo "attendee_cpf" precisa ser válido' })
    @IsNotEmpty({ message: 'o campo "attendee_cpf" deve ser informado' })
    attendee_cpf: string;

    @IsString({ message: 'o campo "mobile_phone" precisa ser válido' })
    @IsNotEmpty({ message: 'o campo "mobile_phone" deve ser informado' })
    mobile_phone: string;

    @IsString({ message: 'o campo "attendee_type" precisa ser válido' })
    @IsNotEmpty({ message: 'o campo "attendee_type" deve ser informado' })
    attendee_type: string;
}
