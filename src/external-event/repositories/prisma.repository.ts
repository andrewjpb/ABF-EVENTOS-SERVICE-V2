// src/external-event/v2/external-event.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExternalEvent } from '@prisma/client';

@Injectable()
export class ExternalEventRepositoryV2 {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Busca um external event pelo id.
     */
    async findById(externalEventId: string): Promise<ExternalEvent | null> {
        return this.prisma.externalEvent.findUnique({
            where: { id: externalEventId },
        });
    }

    /**
     * Deleta um external event pelo id.
     */
    async delete(externalEventId: string): Promise<void> {
        await this.prisma.externalEvent.delete({
            where: { id: externalEventId },
        });
    }
}
