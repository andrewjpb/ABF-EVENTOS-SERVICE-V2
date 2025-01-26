// src/event/v2/event.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Event } from '@prisma/client';

@Injectable()
export class EventRepositoryV2 {
    constructor(private readonly prisma: PrismaService) {}

    async findById(eventId: string): Promise<Event | null> {
        return this.prisma.event.findUnique({
            where: { id: eventId },
        });
    }

    async delete(eventId: string): Promise<void> {
        await this.prisma.event.delete({
            where: { id: eventId },
        });
    }

    // Se precisar de mais métodos (create, update, etc), adicione aqui.
}
