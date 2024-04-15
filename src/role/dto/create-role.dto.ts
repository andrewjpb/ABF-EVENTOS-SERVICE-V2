import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
    @IsString({ message: 'formato invalido' })
    @IsNotEmpty({ message: 'o nome e obrigatorio' })
    name: string;

    @IsString({ message: 'formato invalido' })
    @IsNotEmpty({ message: 'a descricao e obrigatoriaa' })
    description: string;

    @IsArray()
    permissions: string[];
}
