import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveSubscribeDto {
    @IsNotEmpty()
    @IsString()
    eventId: string;

    @IsNotEmpty()
    @IsString()
    attendee_email: string;

    @IsNotEmpty()
    @IsString()
    attendee_rg: string;

    @IsNotEmpty()
    @IsString()
    attendee_cpf: string;
}
