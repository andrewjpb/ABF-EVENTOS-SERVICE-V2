import { IsNotEmpty, IsString } from 'class-validator';

export class RedefinePassDto {
    @IsString({ message: 'the field "newPassword" must be in string format' })
    @IsNotEmpty({ message: 'the field "newPassword" must be informed' })
    newPassword: string;

    @IsString({
        message: 'the field "passConfirmation" must be in string format',
    })
    @IsNotEmpty({ message: 'the field "passConfirmation" must be informed' })
    passConfirmation: string;
}
