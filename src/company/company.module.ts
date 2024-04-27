import { Module } from '@nestjs/common';
import { CompanyRepository } from './company-repository';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CheckExistsCompanyController } from './v2/use-cases/check-exists-company/controller';
import { CheckExistsCompanyService } from './v2/use-cases/check-exists-company/service';
import { CompanyRepositoryV2 } from './v2/repositories/company.repository.prisma';
import { CreateCompanyController } from './v2/use-cases/craete-company/controller';
import { CreateCompanyService } from './v2/use-cases/craete-company/service';

@Module({
    imports: [PrismaModule],
    providers: [
        CompanyRepository,
        CompanyService,
        CheckExistsCompanyService,
        CompanyRepositoryV2,
        CreateCompanyService,
    ],
    controllers: [CompanyController, CheckExistsCompanyController, CreateCompanyController],
    exports: [CompanyService],
})
export class CompanyModule {}
