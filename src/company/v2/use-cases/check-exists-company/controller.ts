import { Body, Controller, Post } from '@nestjs/common';
import { CheckExistsCompanyService } from './service';
import { CheckExistsCompanyDto } from './dto';

interface ResponseCheckExistsCompanyController {
    exists: boolean;
}

@Controller('v2/company')
export class CheckExistsCompanyController {
    constructor(private readonly checkExistsCompanyService: CheckExistsCompanyService) {}

    @Post('/check')
    async checkExistsCompany(@Body() data: CheckExistsCompanyDto): Promise<ResponseCheckExistsCompanyController> {
        const companyExists = await this.checkExistsCompanyService.handle(data.cnpj);
        return { exists: companyExists };
    }
}
