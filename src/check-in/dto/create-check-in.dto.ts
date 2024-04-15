import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateCheckInDto {
    @IsString({ message: 'o campo "userId" precisa ser valido' })
    @IsNotEmpty({ message: 'o campo "userId" deve ser informado' })
    userId: string;

    @IsString({ message: 'o campo "company_cnpj" precisa ser valido' })
    @IsNotEmpty({ message: 'o campo "company_cnpj" deve ser informado' })
    company_cnpj: string;

    @IsString({ message: 'o campo "company_segment" precisa ser valido' })
    @IsNotEmpty({ message: 'o campo "company_segment" deve ser informado' })
    company_segment: string;

    @IsString({ message: 'o campo "attendee_full_name" precisa ser valido' })
    @IsNotEmpty({ message: 'o campo "attendee_full_name" deve ser informado' })
    attendee_full_name: string;

    @IsString({ message: 'o campo "attendee_email" precisa ser valido' })
    @IsNotEmpty({ message: 'o campo "attendee_email" deve ser informado' })
    attendee_email: string;

    @IsString({ message: 'o campo "attendee_position" precisa ser valido' })
    @IsNotEmpty({ message: 'o campo "attendee_position" deve ser informado' })
    attendee_position: string;

    @IsString({ message: 'o campo "attendee_rg" precisa ser valido' })
    @IsNotEmpty({ message: 'o campo "attendee_rg" deve ser informado' })
    attendee_rg: string;

    @IsString({ message: 'o campo "attendee_cpf" precisa ser valido' })
    @IsNotEmpty({ message: 'o campo "attendee_cpf" deve ser informado' })
    attendee_cpf: string;

    @IsBoolean()
    checked_in: boolean;

    @IsString({ message: 'o campo "attendee_phone" precisa ser valido' })
    @IsNotEmpty({ message: 'o campo "attendee_cpf" deve ser informado' })
    mobile_phone: string;

    @IsString({ message: 'o campo "attendee_type" precisa ser valido' })
    @IsNotEmpty({ message: 'o campo "attendee_type" deve ser informado' })
    attendee_type: string;
}
