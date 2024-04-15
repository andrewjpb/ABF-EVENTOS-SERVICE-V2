import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CustomLogger } from '../log/custom.logger';
import { Response } from 'express';
import { PageDto } from '../../shared/dto/page.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserConstants } from '../users/user.constants';
import { AlreadyExistsError } from '../../shared/errors/already-exists.error';
import { StringUtils } from '../util/string.utils';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiTags('Company')
@Controller('company')
export class CompanyController {
    private readonly logger = CustomLogger.getLogger(CompanyController.name);

    constructor(private readonly companyService: CompanyService) {}

    @Get()
    async findAll(
        @Res() response: Response,
        @Query('offset') skip: number,
        @Query('size') take: number,
        @Query('search') search: string,
    ): Promise<any> {
        skip = skip ? skip : 0;
        take = take ? take : 10;
        const companies = await this.companyService.findAll(skip, take, search);
        return response.status(HttpStatus.ACCEPTED).json(new PageDto(await this.companyService.count(), companies));
    }

    @Get(':id')
    async findById(@Param('id') id: string, @Res() response: Response) {
        const result = await this.companyService.getCompanyById(id);
        if (result.error) {
            return response.status(HttpStatus.NOT_FOUND).json({ message: 'company not found' });
        }
        return response.status(HttpStatus.ACCEPTED).json(result.data);
    }

    @Get('/cnpj/:cnpj')
    async findByUsername(@Param('cnpj') cnpj: string, @Res() response: Response) {
        const result = await this.companyService.getCompanyByCnpj(cnpj);
        if (!result) {
            return response.status(HttpStatus.NOT_FOUND).json({ message: 'company not found' });
        }
        return response.status(HttpStatus.ACCEPTED).json(result.data);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        const result = await this.companyService.remove(id);
        if (result.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: result.error.message });
        }

        return response.status(HttpStatus.ACCEPTED).json({
            message: UserConstants.messages.deleteSuccess,
            deletedCompany: result.data,
        });
    }

    @Post()
    async create(@Body() createCompanyDto: CreateCompanyDto, @Res() response: Response): Promise<Response> {
        if (!this.validateDocuments(createCompanyDto)) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                error: `o campo "CNPJ" deve conter apenas números`,
            });
        }

        const result = await this.companyService.create(createCompanyDto);
        if (result.error) {
            const status =
                result.error instanceof AlreadyExistsError ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR;
            return response.status(status).json({ message: result.error.message });
        }

        return response.status(HttpStatus.CREATED).json(result.data);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateCompanyDto: UpdateCompanyDto,
        @Res() response: Response,
    ): Promise<Response> {
        if (!this.validateDocuments(updateCompanyDto)) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                error: `o campo "CNPJ" deve conter apenas números`,
            });
        }

        const result = await this.companyService.update(id, updateCompanyDto);
        if (result.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: result.error.message });
        }

        return response.status(HttpStatus.ACCEPTED).json({
            message: 'empresa atualizada com sucesso',
            company: result.data,
        });
    }

    private validateDocuments(companyDto: UpdateCompanyDto | CreateCompanyDto) {
        return StringUtils.isNumeric(companyDto.cnpj);
    }
}
