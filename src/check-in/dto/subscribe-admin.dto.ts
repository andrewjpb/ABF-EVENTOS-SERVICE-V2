import { IsNotEmpty, IsString } from 'class-validator';

export class SubscribeAdminDto {
    @IsString({ message: 'O campo eventId deve ser uma string.' })
    @IsNotEmpty({ message: 'O campo eventId é obrigatório.' })
    eventId: string;

    @IsString({ message: 'O campo attendee_full_name deve ser uma string.' })
    @IsNotEmpty({ message: 'O campo attendee_full_name é obrigatório.' })
    attendee_full_name: string;

    @IsString({ message: 'O campo attendee_email deve ser uma string.' })
    @IsNotEmpty({ message: 'O campo attendee_email é obrigatório.' })
    attendee_email: string;

    @IsString({ message: 'O campo attendee_position deve ser uma string.' })
    @IsNotEmpty({ message: 'O campo attendee_position é obrigatório.' })
    attendee_position: string;

    @IsString({ message: 'O campo attendee_rg deve ser uma string.' })
    @IsNotEmpty({ message: 'O campo attendee_rg é obrigatório.' })
    attendee_rg: string;

    @IsString({ message: 'O campo attendee_cpf deve ser uma string.' })
    @IsNotEmpty({ message: 'O campo attendee_cpf é obrigatório.' })
    attendee_cpf: string;

    @IsString({ message: 'O campo mobile_phone deve ser uma string.' })
    @IsNotEmpty({ message: 'O campo mobile_phone é obrigatório.' })
    mobile_phone: string;

    @IsString({ message: 'O campo attendee_type deve ser uma string.' })
    @IsNotEmpty({ message: 'O campo attendee_type é obrigatório.' })
    attendee_type: string;

    @IsString({ message: 'O campo cnpj deve ser uma string.' })
    @IsNotEmpty({ message: 'O campo cnpj é obrigatório.' })
    cnpj: string;
}
