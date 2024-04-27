import { Body, Controller, Post } from '@nestjs/common';
import { CreateCompanyService } from './service';
import { CreateCompanyV2Dto } from './dto';
import { Company } from '@prisma/client';

@Controller('v2/company')
export class CreateCompanyController {
    constructor(private readonly createCompanyService: CreateCompanyService) {}

    @Post()
    async CreateCompany(@Body() data: CreateCompanyV2Dto): Promise<Company> {
        return this.createCompanyService.handle(data);
    }
}
