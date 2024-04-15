import { Injectable } from '@nestjs/common';
import { CustomLogger } from '../log/custom.logger';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyRepository {
    private readonly logger = CustomLogger.getLogger(CompanyRepository.name);

    constructor(private readonly prisma: PrismaService) {}

    public createCompany(createCompanyDto: CreateCompanyDto) {
        return this.prisma.company.create({
            data: createCompanyDto,
        });
    }

    public updateCompany(id: string, updateCompanyDto: UpdateCompanyDto) {
        return this.prisma.company.update({
            where: {
                id,
            },
            data: updateCompanyDto,
        });
    }

    public removeCompany(id: string) {
        return this.prisma.company.delete({
            where: { id },
        });
    }

    public getCompanyById(id: string) {
        return this.prisma.company.findUnique({
            where: { id },
        });
    }

    public getCompanyByCnpj(cnpj: string) {
        return this.prisma.company.findUnique({
            where: { cnpj },
        });
    }

    public list(skip: number, take: number, search?: string) {
        const whereClause = search
            ? {
                  OR: [
                      {
                          name: {
                              contains: search,
                              mode: 'insensitive' as const, // as const garante que o tipo será 'insensitive' e não string
                          },
                      },
                      {
                          cnpj: {
                              contains: search,
                              // Não é necessário o mode aqui, pois CNPJ é geralmente um valor exato
                          },
                      },
                  ],
              }
            : {};
        return this.prisma.company.findMany({
            skip,
            take,
            where: whereClause,
        });
    }

    async count(): Promise<number> {
        return this.prisma.company.count();
    }
}
