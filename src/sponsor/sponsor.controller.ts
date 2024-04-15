import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { SponsorService } from './sponsor.service';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { UpdateSponsorDto } from './dto/update-sponsor.dto';
import { Response } from 'express';
import { AlreadyExistsError } from '../../shared/errors/already-exists.error';
import { SponsorConstants } from './sponsor-constants';
import { AuthGuard } from '../auth/auth.guard';
import { PageDto } from '../../shared/dto/page.dto';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiTags('Sponsors')
@Controller('sponsor')
export class SponsorController {
    constructor(private readonly sponsorService: SponsorService) {}

    @Post()
    async create(@Body() createSponsorDto: CreateSponsorDto, @Res() response: Response): Promise<Response> {
        const result = await this.sponsorService.create(createSponsorDto);
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
            .json(new PageDto(await this.sponsorService.count(), await this.sponsorService.findAll(skip, take)));
    }

    @Get(':id')
    async findById(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        const sponsor = await this.sponsorService.findById(id);
        if (!sponsor) {
            return response.status(HttpStatus.NOT_FOUND).json({ message: SponsorConstants.errors.notFoundError });
        }
        return response.status(HttpStatus.ACCEPTED).json(sponsor);
    }

    @Get('/name/:name')
    async findByName(@Param('name') name: string, @Res() response: Response): Promise<Response> {
        const sponsor = await this.sponsorService.findByName(name);
        if (!sponsor) {
            return response.status(HttpStatus.NOT_FOUND).json({ message: SponsorConstants.errors.notFoundError });
        }
        return response.status(HttpStatus.ACCEPTED).json(sponsor);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateSponsorDto: UpdateSponsorDto, @Res() response: Response) {
        const result = await this.sponsorService.update(id, updateSponsorDto);
        if (result.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: result.error.message });
        }
        return response.status(200).json({
            message: SponsorConstants.messages.updateSuccess,
            user: result.data,
        });
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        const result = await this.sponsorService.remove(id);
        if (result.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: result.error.message });
        }
        return response.status(HttpStatus.ACCEPTED).json({
            message: SponsorConstants.messages.deleteSuccess,
            deletedRole: result.data,
        });
    }
}
