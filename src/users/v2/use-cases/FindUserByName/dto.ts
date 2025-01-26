import { IsString, IsNotEmpty } from 'class-validator';

export class FindUserByNameDto {
    @IsString({ message: 'O campo "name" precisa ser válido' })
    @IsNotEmpty({ message: 'O campo "name" deve ser informado' })
    name: string;
}
