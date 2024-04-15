import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { Response } from 'express';
import { AlreadyExistsError } from '../../shared/errors/already-exists.error';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CustomLogger } from '../log/custom.logger';
import { EventTypeEnum } from './enum/event-type.enum';
import { stringify } from 'ts-jest';
import { AuthGuard } from '../auth/auth.guard';
import { PageDto } from '../../shared/dto/page.dto';
import { ApiTags } from '@nestjs/swagger';
import { SponsorService } from '../sponsor/sponsor.service';
import { SupporterService } from '../supporter/supporter.service';
import { Speaker, Sponsor, Supporter } from '@prisma/client';
import { Result } from '../../shared/result/result.model';
import { EventsConstants } from './events.constants';

@ApiTags('Events')
@Controller('event')
export class EventController {
    private readonly logger = CustomLogger.getLogger(EventController.name);

    constructor(
        private readonly eventService: EventService,
        private readonly sponsorService: SponsorService,
        private readonly supporterService: SupporterService,
    ) {}

    @Get()
    async list(
        @Res() response: Response,
        @Query('offset') skip: number,
        @Query('size') take: number,
        @Query('format') format?: EventTypeEnum,
        @Query('date-begin') begin?: string,
        @Query('date-end') end?: string,
        @Query('state') state?: string,
        @Query('city') city?: string,
    ): Promise<Response> {
        skip = skip ? skip : 0;
        take = take && take >= 100 ? take : 100;
        let dateFilter = null;
        if (begin && end) {
            dateFilter = {
                begin,
                end,
            };
            this.logger.info(`filtering events by date range: "${stringify(dateFilter)}"`);
        }
        return response
            .status(HttpStatus.ACCEPTED)
            .json(
                new PageDto(
                    await this.eventService.count(),
                    await this.eventService.list(skip, take, format, dateFilter, state, city),
                ),
            );
    }

    @Get('/:id')
    async findById(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        const result = await this.eventService.findById(id);
        if (result.error) {
            return response.status(HttpStatus.NOT_FOUND).json({ message: result.error.message });
        }
        return response.status(HttpStatus.ACCEPTED).json(result.data);
    }

    @UseGuards(AuthGuard)
    @Post()
    async create(@Body() createEventDto: CreateEventDto, @Res() response: Response): Promise<Response> {
        if (!this.formatIsValid(createEventDto.format)) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                message: 'invalid event format',
                validFormats: Object.values(EventTypeEnum),
            });
        }
        const result = await this.eventService.create(createEventDto);
        if (result.error) {
            const status =
                result.error instanceof AlreadyExistsError ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR;
            return response.status(status).json({ message: result.error.message });
        }

        return response.status(HttpStatus.CREATED).json(result.data);
    }

    @UseGuards(AuthGuard)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateEventDto: UpdateEventDto,
        @Res() response: Response,
    ): Promise<Response> {
        if (!this.formatIsValid(updateEventDto.format)) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                message: 'invalid event format',
                validFormats: Object.values(EventTypeEnum),
            });
        }
        const result = await this.eventService.update(id, updateEventDto);
        if (result.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: result.error.message });
        }
        return response.status(HttpStatus.ACCEPTED).json({
            message: EventsConstants.messages.updateSuccess,
            user: result.data,
        });
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        const result = await this.eventService.remove(id);
        if (result.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: result.error.message });
        }
        return response.status(HttpStatus.ACCEPTED).json({
            message: EventsConstants.messages.deleteSuccess,
            deletedUser: result.data,
        });
    }

    @UseGuards(AuthGuard)
    @Get('/by-user/:userId')
    async getEventsByUser(@Param('userId') userId: string) {
        const response = await this.eventService.getEventsByUser(userId);
        const events = response.data;
        return {
            total: events.length,
            events,
        };
    }

    @Post('/subscribe-sponsor')
    async subscribeSponsor(
        @Body('event-id') eventId: string,
        @Body('sponsor-id') sponsorId: string,
        @Res() response: Response,
    ) {
        const eventResult = await this.eventService.findById(eventId);
        if (eventResult.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: eventResult.error.message });
        }
        const sponsor = await this.sponsorService.findById(sponsorId);
        if (!sponsor) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: 'patrocinador não encontrado' });
        }

        const event = this.parseEventBeforeUpdate(eventResult);
        if (event.sponsors.includes(sponsorId)) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: 'patrocinador já vinculado ao evento' });
        }
        event.sponsors.push(sponsorId);
        const updateDto: UpdateEventDto = { ...event };
        await this.eventService.update(eventId, updateDto);

        const message = 'patrocinador vinculado com sucesso';
        this.logger.info(message);

        return response.status(HttpStatus.ACCEPTED).json({ message });
    }

    @Post('/subscribe-supporter')
    async subscribeSupporter(
        @Body('event-id') eventId: string,
        @Body('supporter-id') supporterId: string,
        @Res() response: Response,
    ) {
        const eventResult = await this.eventService.findById(eventId);
        if (eventResult.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: eventResult.error.message });
        }
        const supporter = await this.supporterService.findById(supporterId);
        if (!supporter) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: 'apoiador não encontrado' });
        }

        const event = this.parseEventBeforeUpdate(eventResult);
        if (event.supporters.includes(supporterId)) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: 'apoiador já vinculado ao evento' });
        }
        event.supporters.push(supporterId);
        const updateDto: UpdateEventDto = { ...event };
        await this.eventService.update(eventId, updateDto);

        const message = 'apoiador vinculado com sucesso';
        this.logger.info(message);

        return response.status(HttpStatus.ACCEPTED).json({ message });
    }

    private parseEventBeforeUpdate(eventResult: Result) {
        const event = eventResult.data;
        event.sponsors = event.sponsors.map((i: Sponsor) => i.id);
        event.supporters = event.supporters.map((i: Supporter) => i.id);
        event.speakers = event.speakers.map((i: Speaker) => i.id);

        return event;
    }

    private formatIsValid(format: EventTypeEnum): boolean {
        return Object.values(EventTypeEnum).includes(format);
    }
}
