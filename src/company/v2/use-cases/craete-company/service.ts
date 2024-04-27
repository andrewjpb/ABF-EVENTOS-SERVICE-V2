import { Injectable } from '@nestjs/common';
import { CompanyRepositoryV2 } from '../../repositories/company.repository.prisma';
import { CreateCompanyV2Dto } from './dto';
import { Company } from '@prisma/client';

@Injectable()
export class CreateCompanyService {
    constructor(private readonly companyRepo: CompanyRepositoryV2) {}

    async handle(data: CreateCompanyV2Dto): Promise<Company> {
        const company = await this.companyRepo.createCompany(data);
        return company;
    }
}
