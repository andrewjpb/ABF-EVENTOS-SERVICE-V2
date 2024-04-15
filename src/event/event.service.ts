import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventRepository } from './event.repository';
import { Result } from '../../shared/result/result.model';
import { EventsConstants } from './events.constants';
import { EntityNotFoundError } from '../../shared/errors/entity-not-found.error';
import slugify from 'slugify';
import { AlreadyExistsError } from '../../shared/errors/already-exists.error';
import { EventUtils } from './util/event.utils';
import { UserConstants } from '../users/user.constants';
import { CustomLogger } from '../log/custom.logger';
import { EventTypeEnum } from './enum/event-type.enum';
import { EventsReportDto } from '../../shared/dto/reports/event/events-report.dto';
import { EventsReportHeaderDto } from '../../shared/dto/reports/event/events-report-header.dto';
import { InternalError } from '../../shared/errors/internal.error';
import { Speaker, Sponsor, Supporter } from '@prisma/client';

@Injectable()
export class EventService {
    private readonly logger = CustomLogger.getLogger(EventService.name);

    constructor(
        private readonly eventRepo: EventRepository,
        private readonly utils: EventUtils,
    ) {}

    async create(createEventDto: CreateEventDto): Promise<Result> {
        const slug = slugify(`${createEventDto.title}-${createEventDto.date}`);
        const alreadyExists = await this.eventRepo.findBySlug(slug);
        if (alreadyExists) {
            this.logger.error(EventsConstants.errors.alreadyExistsError);
            return new Result(
                EventsConstants.errors.alreadyExistsError,
                null,
                new AlreadyExistsError(EventsConstants.errors.alreadyExistsError),
            );
        }
        try {
            const event = await this.eventRepo.create(
                createEventDto,
                createEventDto.addressId,
                this.mapToIdReferenceObjArray(createEventDto.users),
                this.mapToIdReferenceObjArray(createEventDto.speakers),
                this.mapToIdReferenceObjArray(createEventDto.sponsors),
                this.mapToIdReferenceObjArray(createEventDto.supporters),
            );
            if (!event) {
                this.logger.error(EventsConstants.errors.persistenceError);
                return null;
            }
            this.logger.info(`event successfully created, id: ${event.id}`);
            return new Result(EventsConstants.messages.creationSuccess, event, null);
        } catch (error) {
            return new Result(error.message, null, error);
        }
    }

    async count(): Promise<number> {
        return await this.eventRepo.count();
    }

    list(
        skip: number,
        take: number,
        format?: EventTypeEnum,
        dateFilter?: {
            begin: string;
            end: string;
        },
        state?: string,
        city?: string,
    ) {
        this.logger.info(`listing events, offset: ${skip}, page size: ${take}`);
        return this.eventRepo.list(skip, take, format, dateFilter, state, city);
    }

    async findById(id: string): Promise<Result> {
        this.logger.info(`searching database for event ${id}`);
        const event = await this.eventRepo.findById(id);
        if (!event) {
            return new Result(
                EventsConstants.errors.notFoundError,
                null,
                new EntityNotFoundError(EventsConstants.errors.notFoundError),
            );
        }
        const message = `event found: ${event.title}`;
        return new Result(message, event, null);
    }

    private async persistNewImgPath(eventId: string, event: any): Promise<any> {
        event.speakers = event.speakers.map((s: Speaker) => s.id);
        event.sponsors = event.sponsors.map((s: Sponsor) => s.id);
        event.supporters = event.supporters.map((s: Supporter) => s.id);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { created_at, updatedAt, id, ...eventUpdateDto } = event;
        await this.update(eventId, eventUpdateDto);
        this.logger.info(`event images successfully updated on database`);
    }

    async updateTicketImageUrl(eventId: string, ticketImgPath: string): Promise<void> {
        const event = await this.eventRepo.findById(eventId);
        event.ticket_img_path = ticketImgPath;

        await this.persistNewImgPath(eventId, event);
    }

    async updateImageUrl(eventId: string, imagePath: string, imageUrl: string, thumbUrl: string): Promise<void> {
        const event = await this.eventRepo.findById(eventId);
        event.image_url = imageUrl ? imageUrl : event.image_url;
        event.image_path = imageUrl ? imagePath : event.image_path;
        event.thumb_url = thumbUrl ? thumbUrl : event.thumb_url;
        event.thumb_path = thumbUrl ? imagePath : event.thumb_path;

        await this.persistNewImgPath(eventId, event);
    }

    async update(eventId: string, updateEventDto: UpdateEventDto): Promise<Result> {
        const eventById = await this.eventRepo.findById(eventId);
        if (!eventById) {
            this.logger.error(EventsConstants.errors.updateError);
            return new Result(
                EventsConstants.errors.updateError.toString(),
                null,
                new EntityNotFoundError(EventsConstants.errors.notFoundError),
            );
        }
        const findBySlug = await this.eventRepo.findBySlug(this.utils.getEventSlug(eventById));
        if (findBySlug && findBySlug.id !== eventById.id) {
            this.logger.error(EventsConstants.errors.alreadyExistsError);
            return new Result(
                EventsConstants.errors.updateError.toString(),
                null,
                new EntityNotFoundError(EventsConstants.errors.alreadyExistsError),
            );
        }
        const updatedEvent = await this.eventRepo.update(
            eventId,
            updateEventDto,
            updateEventDto.addressId,
            this.mapToIdReferenceObjArray(updateEventDto.speakers),
            this.mapToIdReferenceObjArray(updateEventDto.sponsors),
            this.mapToIdReferenceObjArray(updateEventDto.supporters),
        );

        this.logger.info(`event "${updatedEvent.id}"successfully updated`);
        return new Result(UserConstants.messages.updateSuccess, updatedEvent, null);
    }

    async remove(id: string): Promise<Result> {
        const event = await this.eventRepo.findById(id);
        if (!event) {
            this.logger.error(EventsConstants.errors.notFoundError);
            return new Result(
                EventsConstants.errors.notFoundError.toString(),
                null,
                new EntityNotFoundError(EventsConstants.errors.notFoundError),
            );
        }
        const removedEvent = await this.eventRepo.delete(id);
        this.logger.info(`event "${removedEvent.id}", successfully deleted`);
        return new Result(EventsConstants.messages.deleteSuccess, removedEvent, null);
    }

    public async getEventsReport(
        format?: EventTypeEnum,
        dateFilter?: {
            begin: string;
            end: string;
        },
        state?: string,
        city?: string,
    ): Promise<EventsReportDto> {
        const rows = await this.eventRepo.generateEventsReport(format, dateFilter, state, city);
        const total = rows.length;
        let header = null;
        if (format) {
            this.logger.info(`generating report only for event format: ${format}`);
            switch (format) {
                case EventTypeEnum.IN_PERSON.toString():
                    const inPerson = await this.eventRepo.getEventCountByFormat(EventTypeEnum.IN_PERSON);
                    header = new EventsReportHeaderDto(inPerson);
                    break;
                case EventTypeEnum.ONLINE.toString():
                    const online = await this.eventRepo.getEventCountByFormat(EventTypeEnum.ONLINE);
                    header = new EventsReportHeaderDto(online);
                    break;
                case EventTypeEnum.HYBRID.toString():
                    const hybrid = await this.eventRepo.getEventCountByFormat(EventTypeEnum.HYBRID);
                    header = new EventsReportHeaderDto(hybrid);
                    break;
                case EventTypeEnum.EXTERNAL.toString():
                    const external = await this.eventRepo.getEventCountByFormat(EventTypeEnum.EXTERNAL);
                    header = new EventsReportHeaderDto(external);
                    break;
                default:
                    throw new InternalError('invalid event format');
            }
        } else {
            const inPerson = await this.eventRepo.getEventCountByFormat(EventTypeEnum.IN_PERSON);
            const online = await this.eventRepo.getEventCountByFormat(EventTypeEnum.ONLINE);
            const hybrid = await this.eventRepo.getEventCountByFormat(EventTypeEnum.HYBRID);
            const external = await this.eventRepo.getEventCountByFormat(EventTypeEnum.EXTERNAL);
            header = new EventsReportHeaderDto(total, inPerson, online, hybrid, external);
        }

        return new EventsReportDto(header, rows);
    }

    public async listNextEvents(skip: number, take: number) {
        this.logger.info(`list upcoming events, offset: ${skip}, page size: ${take}`);
        const events = await this.eventRepo.listNextEvents(skip, take);
        this.logger.info(`events found: ${events.length}`);
        return events;
    }

    public async getEventsByUser(userId: string): Promise<Result> {
        const events = []; // TODO - get from attendance_list
        this.logger.info(`user "${userId}" has a total of "${events.length}" events`);
        return new Result(`events found: ${events.length}`, events, null);
    }

    private mapToIdReferenceObjArray(values: string[]) {
        return values.map((v: string) => ({ id: v }));
    }
}
