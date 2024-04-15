import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
    @IsString({ message: 'the field "name" must be in string format' })
    @IsNotEmpty({ message: 'the field "name" must be informed' })
    name: string;

    @IsString({ message: 'the field "username" must be in string format' })
    @IsNotEmpty({ message: 'the field "username" must be informed' })
    username: string;

    @IsString({ message: 'the field "email" must be in string format' })
    @IsNotEmpty({ message: 'the field "email" must be informed' })
    email: string;

    @IsString({ message: 'the field "rg" must be in string format' })
    @IsNotEmpty({ message: 'the field "rg" must be informed' })
    rg: string;

    @IsString({ message: 'the field "cpf" must be in string format' })
    @IsNotEmpty({ message: 'the field "cpf" must be informed' })
    cpf: string;

    @IsString({ message: 'the field "cnpj" must be in string format' })
    @IsNotEmpty({ message: 'the field "cnpj" must be informed' })
    cnpj: string;

    @IsString({ message: 'the field "position" must be in string format' })
    @IsNotEmpty({ message: 'the field "position" must be informed' })
    position: string;

    @IsString({ message: 'the field "city" must be in string format' })
    @IsNotEmpty({ message: 'the field "city" must be informed' })
    city: string;

    @IsString({ message: 'the field "state" must be in string format' })
    @IsNotEmpty({ message: 'the field "state" must be informed' })
    state: string;

    @IsString({ message: 'the field "image_url" must be in string format' })
    image_url: string;

    @IsString({ message: 'the field "thumb_url" must be in string format' })
    thumb_url: string;

    @IsString({ message: 'the field "password" must be in string format' })
    password: string;

    @IsString({ message: 'the field "mobile_phone" must be in string format' })
    @IsNotEmpty({ message: 'the field "mobile_phone" must be informed' })
    mobile_phone: string;
}
