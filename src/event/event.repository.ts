import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Event } from '@prisma/client';
import { CreateEventDto } from './dto/create-event.dto';
import { EventsConstants } from './events.constants';
import { UpdateEventDto } from './dto/update-event.dto';
import slugify from 'slugify';
import { CustomLogger } from '../log/custom.logger';
import { EventTypeEnum } from './enum/event-type.enum';
import { stringify } from 'ts-jest';
import { EventsReportRowDto } from '../../shared/dto/reports/event/events-report-row.dto';

@Injectable()
export class EventRepository {
    private readonly logger = CustomLogger.getLogger(EventRepository.name);

    constructor(private readonly prisma: PrismaService) {}

    private buildAddressFilter(args: any, state: string, city: string) {
        if (city || state) {
            let address = {};
            if (state) {
                address = {
                    ...address,
                    state,
                };
            }
            if (city) {
                address = {
                    ...address,
                    city,
                };
            }
            return {
                ...args,
                address,
            };
        }
        return args;
    }

    count(): Promise<number> {
        return this.prisma.event.count();
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
    ): Promise<Event[]> {
        let args = null;
        if (format) {
            args = { ...args, format };
        }
        if (dateFilter) {
            args = {
                ...args,
                date: {
                    gte: new Date(dateFilter.begin),
                    lte: new Date(dateFilter.end),
                },
            };
        }
        if (args) {
            args = this.buildAddressFilter(args, state, city);
            this.logger.info(`filtering criteria: ${stringify(stringify(args))}`);
            return this.prisma.event.findMany({
                where: { ...args },
                include: {
                    speakers: true,
                    sponsors: true,
                    supporters: true,
                    address: true,
                },
                skip,
                take,
                orderBy: { date: 'desc' },
            });
        }

        return this.prisma.event.findMany({
            include: {
                speakers: true,
                sponsors: true,
                supporters: true,
                address: true,
            },
            skip,
            take,
            orderBy: { date: 'desc' },
        });
    }

    findById(id: string): Promise<any> {
        const event = this.prisma.event.findUnique({
            where: { id },
            include: {
                speakers: true,
                sponsors: true,
                supporters: true,
                address: true,
            },
        });

        if (!event) {
            this.logger.error(EventsConstants.errors.notFoundError);
            return null;
        }

        return event;
    }

    findBySlug(slug: string): Promise<Event> {
        const event = this.prisma.event.findUnique({ where: { slug } });
        if (!event) {
            this.logger.error(`event not found: ${slug}`);
        }
        return event;
    }

    create(
        createEventDto: CreateEventDto,
        addressId: string,
        users: { id: string }[],
        speakers: { id: string }[],
        sponsors: { id: string }[],
        supporters: { id: string }[],
    ): Promise<Event> {
        return this.prisma.event.create({
            data: {
                title: createEventDto.title,
                slug: slugify(`${createEventDto.title}-${createEventDto.date}`),
                image_url: createEventDto.image_url,
                thumb_url: createEventDto.thumb_url,
                summary: createEventDto.summary,
                description: createEventDto.description,
                date: new Date(createEventDto.date),
                vacancy_total: createEventDto.vacancy_total,
                vacancies_per_brand: createEventDto.vacancies_per_brand,
                minimum_quorum: createEventDto.minimum_quorum,
                highlight: createEventDto.highlight,
                format: createEventDto.format,
                start_time: createEventDto.start_time,
                end_time: createEventDto.end_time,
                schedule_link: createEventDto.schedule_link,
                transmission_link: createEventDto.transmission_link,
                address: {
                    connect: {
                        id: addressId,
                    },
                },
                speakers: {
                    connect: speakers,
                },
                sponsors: {
                    connect: sponsors,
                },
                supporters: {
                    connect: supporters,
                },
            },
        });
    }

    update(
        eventId: string,
        updateEventDto: UpdateEventDto,
        addressId: string,
        speakers: { id: string }[],
        sponsors: { id: string }[],
        supporters: { id: string }[],
    ): Promise<Event> {
        return this.prisma.event.update({
            where: {
                id: eventId,
            },
            data: {
                title: updateEventDto.title,
                image_url: updateEventDto.image_url,
                thumb_url: updateEventDto.thumb_url,
                image_path: updateEventDto.image_path,
                thumb_path: updateEventDto.thumb_path,
                ticket_img_path: updateEventDto.ticket_img_path,
                summary: updateEventDto.summary,
                description: updateEventDto.description,
                vacancy_total: updateEventDto.vacancy_total,
                vacancies_per_brand: updateEventDto.vacancies_per_brand,
                minimum_quorum: updateEventDto.minimum_quorum,
                highlight: updateEventDto.highlight,
                format: updateEventDto.format,
                start_time: updateEventDto.start_time,
                schedule_link: updateEventDto.schedule_link,
                end_time: updateEventDto.end_time,
                transmission_link: updateEventDto.transmission_link,
                date: new Date(updateEventDto.date),
                slug: slugify(`${updateEventDto.title}-${updateEventDto.date}`),
                free_online: updateEventDto.free_online,
                address: {
                    connect: {
                        id: addressId,
                    },
                },
                speakers: {
                    set: speakers,
                },
                sponsors: {
                    set: sponsors,
                },
                supporters: {
                    set: supporters,
                },
            },
        });
    }

    listNextEvents(skip: number, take: number) {
        const rangeStart = this.getTodayPlusDays(0);
        const rangeEnd = this.getTodayPlusDays(1);
        return this.prisma.event.findMany({
            where: {
                date: {
                    gt: rangeStart,
                    lte: rangeEnd,
                },
            },
            include: {
                address: true,
                speakers: true,
                sponsors: true,
                supporters: true,
            },
            skip,
            take,
        });
    }

    delete(id: string): Promise<Event> {
        return this.prisma.event.delete({ where: { id } });
    }

    async getEventCountByFormat(format: EventTypeEnum): Promise<number> {
        return this.prisma.event.count({
            where: { format },
        });
    }

    async generateEventsReport(
        format?: EventTypeEnum,
        dateFilter?: {
            begin: string;
            end: string;
        },
        state?: string,
        city?: string,
    ): Promise<EventsReportRowDto[]> {
        let args = null;
        if (format) {
            args = { ...args, format };
        }
        if (dateFilter) {
            args = {
                ...args,
                date: {
                    gte: new Date(dateFilter.begin),
                    lte: new Date(dateFilter.end),
                },
            };
        }
        let events;
        if (args) {
            args = this.buildAddressFilter(args, state, city);
            events = await this.prisma.event.findMany({
                where: { ...args },
                orderBy: {
                    title: 'asc',
                },
                select: {
                    id: true,
                    title: true,
                    summary: true,
                    description: true,
                    format: true,
                    date: true,
                    address: true,
                    _count: {
                        select: {
                            speakers: true,
                            sponsors: true,
                            supporters: true,
                        },
                    },
                },
            });
        } else {
            events = await this.prisma.event.findMany({
                orderBy: {
                    title: 'asc',
                },
                select: {
                    id: true,
                    title: true,
                    summary: true,
                    description: true,
                    format: true,
                    date: true,
                    address: true,
                    _count: {
                        select: {
                            speakers: true,
                            sponsors: true,
                            supporters: true,
                        },
                    },
                },
            });
        }

        return events.map(
            (event: {
                id: string;
                title: string;
                summary: string;
                description: string;
                format: string;
                date: string;
                _count: {
                    users: number;
                    speakers: number;
                    sponsors: number;
                    supporters: number;
                };
                address: { state: string; city: string };
            }) => {
                return new EventsReportRowDto(
                    event.id,
                    event.title,
                    event.summary,
                    event.description,
                    event.format,
                    event.date,
                    event._count.users,
                    event._count.speakers,
                    event._count.sponsors,
                    event._count.supporters,
                    event.address.state,
                    event.address.city,
                );
            },
        );
    }

    private getTodayPlusDays(days: number): Date {
        const today = new Date();
        const desiredDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        desiredDate.setDate(today.getDate() + days);
        return desiredDate;
    }
}
