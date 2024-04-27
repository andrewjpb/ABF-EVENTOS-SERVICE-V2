import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyV2Dto } from '../use-cases/craete-company/dto';
import { EntityNotFoundError } from 'shared/errors/entity-not-found.error';
import { Company } from '@prisma/client';

@Injectable()
export class CompanyRepositoryV2 {
    constructor(private readonly prisma: PrismaService) {}

    async checkCompanyExists(cnpj: string) {
        const company = await this.prisma.company.findUnique({
            where: {
                cnpj,
            },
        });

        return !!company;
    }

    async createCompany(data: CreateCompanyV2Dto): Promise<Company> {
        const companyExists = await this.checkCompanyExists(data.cnpj);
        if (companyExists) {
            throw new EntityNotFoundError('empresa ja cadastrada');
        }
        const createCompany = this.prisma.company.create({
            data: data,
        });

        return createCompany;
    }
}
