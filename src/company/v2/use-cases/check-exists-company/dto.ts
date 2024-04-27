import { IsNotEmpty, IsString } from 'class-validator';

export class CheckExistsCompanyDto {
    @IsString({ message: 'o campo "cnpj" precisa ser valido' })
    @IsNotEmpty({ message: 'o campo "cnpj" deve ser informado' })
    cnpj: string;
}
