// src/external-event/v2/delete/services/deleteExternalEvent.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { ExternalEventRepositoryV2 } from 'src/external-event/repositories/prisma.repository';

@Injectable()
export class DeleteExternalEventService {
    constructor(private readonly externalEventRepository: ExternalEventRepositoryV2) {}

    async execute(externalEventId: string): Promise<void> {
        const externalEvent = await this.externalEventRepository.findById(externalEventId);

        if (!externalEvent) {
            throw new NotFoundException('ExternalEvent não encontrado');
        }

        // Se precisar de mais validações (ex: em uso por algo), faça aqui.

        await this.externalEventRepository.delete(externalEventId);
    }
}
