import { IsString } from 'class-validator';

export class LoginDto {
    @IsString({ message: 'informe um usuario' })
    username: string;

    @IsString({ message: 'informe uma senha' })
    password: string;
}
