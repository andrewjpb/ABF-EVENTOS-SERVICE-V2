import { Injectable } from '@nestjs/common';
import { CustomLogger } from '../log/custom.logger';
import { CompanyRepository } from './company-repository';
import { Result } from '../../shared/result/result.model';
import { EntityNotFoundError } from '../../shared/errors/entity-not-found.error';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AlreadyExistsError } from '../../shared/errors/already-exists.error';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompanyService {
    private readonly logger = CustomLogger.getLogger(CompanyService.name);

    constructor(private readonly companyRepo: CompanyRepository) {}

    public async getCompanyById(id: string) {
        const company = await this.companyRepo.getCompanyById(id);
        if (!company) {
            const message = `company not found for id: ${id}`;
            this.logger.error(message);
            return new Result(message, null, new EntityNotFoundError(message));
        }

        const message = `company "${company.name}", found for id: ${id}`;

        return new Result(message, company, null);
    }

    public async getCompanyByCnpj(cnpj: string) {
        const company = await this.companyRepo.getCompanyByCnpj(cnpj);
        if (!company) {
            const message = `company not found for cnpj: ${cnpj}`;
            this.logger.error(message);
            return new Result(message, null, new EntityNotFoundError(message));
        }

        const message = `company "${company.name}", found for cnpj: ${cnpj}`;

        return new Result(message, company, null);
    }

    async count(): Promise<number> {
        return await this.companyRepo.count();
    }

    async findAll(skip: number, take: number, search?: string) {
        this.logger.info(`listing companies, offset: ${skip} - limit: ${take}`);
        const companies = await this.companyRepo.list(skip, take, search);
        this.logger.info(`companies found: ${companies.length}`);
        return companies;
    }

    async remove(id: string): Promise<any> {
        this.logger.info(`removing company "${id}"`);
        const result = await this.getCompanyById(id);
        if (result.error) {
            return new Result(result.error.message, null, new EntityNotFoundError(result.error.message));
        }
        const removedCompany = await this.companyRepo.removeCompany(id);
        const message = 'company successfully removed';
        this.logger.info(message);
        return new Result(message, removedCompany, null);
    }

    async update(id: string, userUpdateDTO: UpdateCompanyDto) {
        this.logger.info(`updating company "${id}"`);
        const companyById = await this.getCompanyById(id);
        const companyByCnpj = await this.companyRepo.getCompanyByCnpj(userUpdateDTO.cnpj);
        if (companyById.error) {
            this.logger.error('company not found');
            return new Result('error updating company, not found', null, new EntityNotFoundError('company not found'));
        } else if (companyByCnpj && companyByCnpj.id !== id) {
            return new Result('cnpj já registrado', null, new EntityNotFoundError('cnpj já registrado'));
        }

        const updatedCompany = await this.companyRepo.updateCompany(id, userUpdateDTO);
        this.logger.info(`company "${updatedCompany.id}" successfully updated`);

        return new Result('company successfully updated', updatedCompany, null);
    }

    async create(createCompanyDto: CreateCompanyDto): Promise<Result> {
        this.logger.info('persisting new company');
        const companyByCnpj = await this.companyRepo.getCompanyByCnpj(createCompanyDto.cnpj);
        if (companyByCnpj) {
            const message = 'cnpj já registrado';
            this.logger.error(message);
            return new Result(message, null, new AlreadyExistsError(message));
        }

        try {
            const company = await this.companyRepo.createCompany(createCompanyDto);
            const message = `company successfully persisted, id: ${company.id}`;
            this.logger.info(message);
            return new Result(message, company, null);
        } catch (error) {
            return new Result(error.message, null, error);
        }
    }
}
