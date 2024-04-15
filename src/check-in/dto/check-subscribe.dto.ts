import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

export class CheckSubscribeDto {
    @IsOptional()
    cnpj?: string;

    @IsOptional()
    idEvento?: string;

    @IsOptional()
    cpf?: string;

    @ValidateIf((o) => !o.cnpj && !o.idEvento && !o.cpf)
    @IsNotEmpty({ message: 'Ao menos um dos campos (cnpj, idEvento, cpf) deve ser fornecido.' })
    atLeastOneField: string = '';
}
