import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { SupporterService } from './supporter.service';
import { CreateSupporterDto } from './dto/create-supporter.dto';
import { UpdateSupporterDto } from './dto/update-supporter.dto';
import { Response } from 'express';
import { SupporterConstants } from './supporter-constants';
import { AlreadyExistsError } from '../../shared/errors/already-exists.error';
import { AuthGuard } from '../auth/auth.guard';
import { PageDto } from '../../shared/dto/page.dto';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiTags('Supporters')
@Controller('supporter')
export class SupporterController {
    constructor(private readonly supporterService: SupporterService) {}

    @Post()
    async create(@Body() createSupporterDto: CreateSupporterDto, @Res() response: Response): Promise<Response> {
        const result = await this.supporterService.create(createSupporterDto);
        if (result.error) {
            const status =
                result.error instanceof AlreadyExistsError ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR;
            return response.status(status).json({ message: result.error.message });
        }
        return response.status(HttpStatus.CREATED).json(result.data);
    }

    @Get()
    async findAll(@Res() response: Response, @Query('offset') skip: number, @Query('size') take: number) {
        skip = skip ? skip : 0;
        take = take && take >= 100 ? take : 100;
        return response
            .status(HttpStatus.ACCEPTED)
            .json(new PageDto(await this.supporterService.count(), await this.supporterService.findAll(skip, take)));
    }

    @Get(':id')
    async findById(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        const supporter = await this.supporterService.findById(id);
        if (!supporter) {
            return response.status(HttpStatus.NOT_FOUND).json({ message: SupporterConstants.errors.notFoundError });
        }
        return response.status(HttpStatus.ACCEPTED).json(supporter);
    }

    @Get('/name/:name')
    async findByName(@Param('name') name: string, @Res() response: Response): Promise<Response> {
        const supporter = await this.supporterService.findByName(name);
        if (!supporter) {
            return response.status(HttpStatus.NOT_FOUND).json({ message: SupporterConstants.errors.notFoundError });
        }
        return response.status(HttpStatus.ACCEPTED).json(supporter);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateSupporterDto: UpdateSupporterDto, @Res() response: Response) {
        const result = await this.supporterService.update(id, updateSupporterDto);
        if (result.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: result.error.message });
        }
        return response.status(200).json({
            message: SupporterConstants.messages.updateSuccess,
            user: result.data,
        });
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        const result = await this.supporterService.remove(id);
        if (result.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: result.error.message });
        }
        return response.status(HttpStatus.ACCEPTED).json({
            message: SupporterConstants.messages.deleteSuccess,
            deletedRole: result.data,
        });
    }
}
