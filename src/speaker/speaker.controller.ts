import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { SpeakerService } from './speaker.service';
import { CreateSpeakerDto } from './dto/create-speaker.dto';
import { Response } from 'express';
import { AlreadyExistsError } from '../../shared/errors/already-exists.error';
import { SpeakerConstants } from './speaker-constants';
import { UpdateSpeakerDto } from './dto/update-speaker.dto';
import { AuthGuard } from '../auth/auth.guard';
import { PageDto } from '../../shared/dto/page.dto';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiTags('Speakers')
@Controller('speaker')
export class SpeakerController {
    constructor(private readonly speakerService: SpeakerService) {}

    @Post()
    async create(@Body() createSpeakerDto: CreateSpeakerDto, @Res() response: Response): Promise<Response> {
        const result = await this.speakerService.create(createSpeakerDto);
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
            .json(new PageDto(await this.speakerService.count(), await this.speakerService.findAll(skip, take)));
    }

    @Get(':id')
    async findById(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        const speaker = await this.speakerService.findById(id);
        if (!speaker) {
            return response.status(HttpStatus.NOT_FOUND).json({ message: SpeakerConstants.errors.notFoundError });
        }
        return response.status(HttpStatus.ACCEPTED).json(speaker);
    }

    @Get('/name/:name')
    async findByName(@Param('name') name: string, @Res() response: Response): Promise<Response> {
        const speaker = await this.speakerService.findByName(name);
        if (!speaker) {
            return response.status(HttpStatus.NOT_FOUND).json({ message: SpeakerConstants.errors.notFoundError });
        }
        return response.status(HttpStatus.ACCEPTED).json(speaker);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateSpeakerDto: UpdateSpeakerDto, @Res() response: Response) {
        const result = await this.speakerService.update(id, updateSpeakerDto);
        if (result.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: result.error.message });
        }
        return response.status(200).json({
            message: SpeakerConstants.messages.updateSuccess,
            user: result.data,
        });
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        const result = await this.speakerService.remove(id);
        if (result.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: result.error.message });
        }
        return response.status(HttpStatus.ACCEPTED).json({
            message: SpeakerConstants.messages.deleteSuccess,
            deletedRole: result.data,
        });
    }
}
