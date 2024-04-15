import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AlreadyExistsError } from '../../shared/errors/already-exists.error';
import { AuthGuard } from '../auth/auth.guard';
import { PageDto } from '../../shared/dto/page.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateHighlightCardDto } from './dtos/create-highlight-card.dto';
import { HighlightCardService } from './highlight-card-service';
import { UpdateHighlightCardDto } from './dtos/update-highlight-card.dto';

@ApiTags('Cards')
@Controller('card')
export class HighlightCardController {
    constructor(private readonly cardService: HighlightCardService) {}

    @UseGuards(AuthGuard)
    @Post()
    async create(@Body() createHighlightCardDto: CreateHighlightCardDto, @Res() response: Response): Promise<Response> {
        const result = await this.cardService.create(createHighlightCardDto);
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
            .json(new PageDto(await this.cardService.count(), await this.cardService.findAll(skip, take)));
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    async findById(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        const card = await this.cardService.findById(id);
        if (!card) {
            return response.status(HttpStatus.NOT_FOUND).json({ message: 'card não encontrado' });
        }
        return response.status(HttpStatus.ACCEPTED).json(card);
    }

    @UseGuards(AuthGuard)
    @Get('/card/:title')
    async findByName(@Param('title') title: string, @Res() response: Response): Promise<Response> {
        const card = await this.cardService.findByName(title);
        if (!card) {
            return response.status(HttpStatus.NOT_FOUND).json({ message: 'card não encontrado' });
        }
        return response.status(HttpStatus.ACCEPTED).json(card);
    }

    @UseGuards(AuthGuard)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateHighlightCardDto: UpdateHighlightCardDto,
        @Res() response: Response,
    ) {
        const result = await this.cardService.update(id, updateHighlightCardDto);
        if (result.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: result.error.message });
        }
        return response.status(200).json({
            message: 'card atualizado com sucesso',
            user: result.data,
        });
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        const result = await this.cardService.remove(id);
        if (result.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: result.error.message });
        }
        return response.status(HttpStatus.ACCEPTED).json({
            message: 'card removido com sucesso',
            deletedRole: result.data,
        });
    }
}
