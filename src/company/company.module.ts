import { Module } from '@nestjs/common';
import { CompanyRepository } from './company-repository';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [CompanyRepository, CompanyService],
    controllers: [CompanyController],
    exports: [CompanyService],
})
export class CompanyModule {}
