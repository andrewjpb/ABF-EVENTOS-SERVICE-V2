import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
    @IsString({ message: 'the field "name" must be in string format' })
    @IsNotEmpty({ message: 'the field "name" must be informed' })
    name: string;

    @IsString({ message: 'the field "description" must be in string format' })
    @IsNotEmpty({ message: 'the field "description" must be informed' })
    description: string;
}
