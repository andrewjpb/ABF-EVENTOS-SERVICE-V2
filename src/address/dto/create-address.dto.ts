import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
    @IsString({ message: 'the field "city" must be in string format' })
    @IsNotEmpty({ message: 'the field "city" must be informed' })
    cityId: string;

    @IsString({ message: 'the field "state" must be in string format' })
    @IsNotEmpty({ message: 'the field "state" must be informed' })
    stateId: string;

    @IsString({ message: 'the field "street" must be in string format' })
    @IsNotEmpty({ message: 'the field "street" must be informed' })
    street: string;

    @IsString({ message: 'the field "number" must be in string format' })
    @IsNotEmpty({ message: 'the field "number" must be informed' })
    number: string;

    @IsString({ message: 'the field "postal_code" must be in string format' })
    @IsNotEmpty({ message: 'the field "postal_code" must be informed' })
    postal_code: string;

    @IsOptional()
    @IsString({ message: 'the field "complement" must be in string format' })
    complement: string;
}
