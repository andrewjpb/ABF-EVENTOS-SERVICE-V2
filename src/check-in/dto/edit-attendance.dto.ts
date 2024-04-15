import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class EditeSubscribeDto {
    @IsNotEmpty()
    @IsString()
    @IsIn(['online', 'in_person'])
    attendee_type: string;
}
