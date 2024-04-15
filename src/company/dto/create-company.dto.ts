import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyDto {
    @IsString({ message: 'o campo "name" precisa ser valido' })
    @IsNotEmpty({ message: 'o campo "name" deve ser informado' })
    name: string;

    @IsString({ message: 'o campo "cnpj" precisa ser valido' })
    @IsNotEmpty({ message: 'o campo "cnpj" deve ser informado' })
    cnpj: string;

    @IsString({ message: 'o campo "segment" precisa ser valido' })
    @IsNotEmpty({ message: 'o campo "segment" deve ser informado' })
    segment: string;
}
