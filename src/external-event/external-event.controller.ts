import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ExternalEventService } from './external-event.service';
import { Response } from 'express';
import { AlreadyExistsError } from '../../shared/errors/already-exists.error';
import { AuthGuard } from '../auth/auth.guard';
import { PageDto } from '../../shared/dto/page.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateExternalEventDto } from './dto/create-external-event.dto';
import { UpdateExternalEventDto } from './dto/update-external-event.dto';

@UseGuards(AuthGuard)
@ApiTags('External Events')
@Controller('/external')
export class ExternalEventController {
    constructor(private readonly externalEventService: ExternalEventService) {}

    @Post()
    async create(@Body() createExternalEventDto: CreateExternalEventDto, @Res() response: Response): Promise<Response> {
        const result = await this.externalEventService.create(createExternalEventDto);
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
            .json(
                new PageDto(
                    await this.externalEventService.count(),
                    await this.externalEventService.findAll(skip, take),
                ),
            );
    }

    @Get(':id')
    async findById(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        const externalEvent = await this.externalEventService.findById(id);
        if (!externalEvent) {
            return response.status(HttpStatus.NOT_FOUND).json({ message: 'evento externo não encontrado' });
        }
        return response.status(HttpStatus.ACCEPTED).json(externalEvent);
    }

    @Get('/title/:title')
    async findByName(@Param('title') title: string, @Res() response: Response): Promise<Response> {
        const externalEvent = await this.externalEventService.findByName(title);
        if (!externalEvent) {
            return response.status(HttpStatus.NOT_FOUND).json({ message: 'evento externo não encontrado' });
        }
        return response.status(HttpStatus.ACCEPTED).json(externalEvent);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateExternalEventDto: UpdateExternalEventDto,
        @Res() response: Response,
    ) {
        const result = await this.externalEventService.update(id, updateExternalEventDto);
        if (result.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: result.error.message });
        }
        return response.status(200).json({
            message: 'evento externo atualizado com sucesso',
            user: result.data,
        });
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        const result = await this.externalEventService.remove(id);
        if (result.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: result.error.message });
        }
        return response.status(HttpStatus.ACCEPTED).json({
            message: 'evento externo removido com sucesso',
            deletedRole: result.data,
        });
    }
}
