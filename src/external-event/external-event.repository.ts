import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ExternalEvent } from '@prisma/client';
import { CustomLogger } from '../log/custom.logger';
import { CreateExternalEventDto } from './dto/create-external-event.dto';
import { UpdateExternalEventDto } from './dto/update-external-event.dto';

@Injectable()
export class ExternalEventRepository {
    private readonly logger = CustomLogger.getLogger(ExternalEventRepository.name);

    constructor(private prisma: PrismaService) {}

    async create(createExternalEventDto: CreateExternalEventDto): Promise<ExternalEvent> {
        const { date, ...data } = createExternalEventDto;
        return this.prisma.externalEvent.create({
            data: {
                date: new Date(date),
                ...data,
            },
        });
    }

    async findById(id: string): Promise<any> {
        const externalEvent = await this.prisma.externalEvent.findUnique({
            where: {
                id,
            },
        });

        if (!externalEvent) {
            this.logger.error(`external event "${id}" not found`);
            return null;
        }

        return externalEvent;
    }

    async findByTitle(title: string): Promise<ExternalEvent> {
        const sponsor = await this.prisma.externalEvent.findFirst({
            where: {
                title,
            },
        });

        if (!sponsor) {
            this.logger.error(`external event "${title}" not found`);
            return null;
        }

        return sponsor;
    }

    async count(): Promise<number> {
        return this.prisma.externalEvent.count();
    }

    async listAll(skip: number, take: number): Promise<ExternalEvent[]> {
        return this.prisma.externalEvent.findMany({
            skip,
            take,
        });
    }

    async update(id: string, updateExternalEventDto: UpdateExternalEventDto): Promise<any> {
        const { date, ...data } = updateExternalEventDto;
        return this.prisma.externalEvent.update({
            where: { id },
            data: {
                date: new Date(date),
                ...data,
            },
        });
    }

    async delete(id: string): Promise<{ id: string; title: string }> {
        const deletedExternalEvent = await this.prisma.externalEvent.delete({
            where: { id },
        });

        return {
            id: deletedExternalEvent.id,
            title: deletedExternalEvent.title,
        };
    }
}
