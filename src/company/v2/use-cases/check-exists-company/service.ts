import { Injectable } from '@nestjs/common';
import { CompanyRepositoryV2 } from '../../repositories/company.repository.prisma';

@Injectable()
export class CheckExistsCompanyService {
    constructor(private readonly companyRepo: CompanyRepositoryV2) {}

    async handle(cnpj: string): Promise<boolean> {
        const companyExists = await this.companyRepo.checkCompanyExists(cnpj);

        return companyExists;
    }
}
