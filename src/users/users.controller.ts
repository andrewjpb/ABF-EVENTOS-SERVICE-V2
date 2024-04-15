import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { UserConstants } from './user.constants';
import { AlreadyExistsError } from '../../shared/errors/already-exists.error';
import { User } from '@prisma/client';
import { JobService } from '../jobs/job.service';
import { AuthGuard } from '../auth/auth.guard';
import { PageDto } from '../../shared/dto/page.dto';
import { StringUtils } from '../util/string.utils';
import { ApiTags } from '@nestjs/swagger';
import { CompanyService } from '../company/company.service';
import { CustomLogger } from '../log/custom.logger';
import { PaginationParamsUserDto } from './dto/query-list-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    private readonly logger = CustomLogger.getLogger(UsersController.name);

    constructor(
        private readonly usersService: UsersService,
        private readonly jobService: JobService,
        private readonly companyService: CompanyService,
    ) {}

    @UseGuards(AuthGuard)
    @Get()
    async findAll(@Res() response: Response, @Query() params: PaginationParamsUserDto): Promise<any> {
        const users = await this.usersService.findAllPaginated(params);
        const totalCount = await this.usersService.count();

        return response.status(HttpStatus.ACCEPTED).json(
            new PageDto(
                totalCount,
                users.map((u: User) => this.usersService.sanitizeUser(u)),
            ),
        );
    }

    @UseGuards(AuthGuard)
    @Get('/username/:username')
    async findByUsername(@Param('username') username: string, @Res() response: Response): Promise<Response> {
        const user = await this.usersService.findByUsername(username);
        if (!user) {
            return response.status(HttpStatus.NOT_FOUND).json({ message: UserConstants.errors.notFoundError });
        }
        return response.status(HttpStatus.ACCEPTED).json(this.usersService.sanitizeUser(user));
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    async findById(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        const result = await this.usersService.findById(id);
        if (result.error) {
            return response.status(HttpStatus.NOT_FOUND).json({ message: UserConstants.errors.notFoundError });
        }
        return response.status(HttpStatus.ACCEPTED).json(this.usersService.sanitizeUser(result.data));
    }

    @Post()
    async create(@Body() createUserDto: CreateUserDto, @Res() response: Response): Promise<Response> {
        if (!this.validateDocuments(createUserDto)) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                error: `os campos "CPF" e "CNPJ" devem conter apenas números`,
            });
        }
        if (!(await this.companyExists(createUserDto.cnpj))) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: 'cnpj não encontrado' });
        }
        const result = await this.usersService.create(createUserDto);
        if (result.error) {
            const status =
                result.error instanceof AlreadyExistsError ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR;
            return response.status(status).json({ message: result.error.message });
        }
        await this.jobService.pushWelcomeEmailJob(createUserDto.name, createUserDto.email);
        return response.status(HttpStatus.CREATED).json(this.usersService.sanitizeUser(result.data));
    }

    @UseGuards(AuthGuard)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @Res() response: Response,
    ): Promise<Response> {
        if (updateUserDto.cnpj) {
            if (!(await this.companyExists(updateUserDto.cnpj))) {
                return response.status(HttpStatus.BAD_REQUEST).json({ message: 'cnpj não encontrado' });
            }
        }
        const result = await this.usersService.update(id, updateUserDto);
        if (result.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: result.error.message });
        }
        return response.status(HttpStatus.ACCEPTED).json({
            message: UserConstants.messages.updateSuccess,
            user: this.usersService.sanitizeUser(result.data),
        });
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        const result = await this.usersService.remove(id);
        if (result.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: result.error.message });
        }
        return response.status(HttpStatus.ACCEPTED).json({
            message: UserConstants.messages.deleteSuccess,
            deletedUser: this.usersService.sanitizeUser(result.data),
        });
    }

    @UseGuards(AuthGuard)
    @Patch('/status/:id')
    async inactivateUser(@Param('id') id: string, @Body('active') active: boolean) {
        return await this.usersService.updateStatus(id, active);
    }

    private validateDocuments(userDto: UpdateUserDto | CreateUserDto) {
        return StringUtils.isNumeric(userDto.cpf) && StringUtils.isNumeric(userDto.cnpj);
    }

    private async companyExists(cnpj: string) {
        const result = await this.companyService.getCompanyByCnpj(cnpj);
        if (result.error) {
            this.logger.error('a empresa informada não existe na base de dados');
            return false;
        }

        return true;
    }
}
