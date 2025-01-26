// src/event/v2/usecases/remove/services/deleteEvent.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { EventRepositoryV2 } from 'src/event/repository/prisma.repository';

@Injectable()
export class DeleteEventService {
    constructor(private readonly eventRepository: EventRepositoryV2) {}

    async execute(eventId: string): Promise<void> {
        // Verificar se o evento existe
        const event = await this.eventRepository.findById(eventId);
        if (!event) {
            throw new NotFoundException('Evento não encontrado');
        }

        // Se quiser fazer mais validações (ex: verificar se não está em uso), faça aqui.

        // Agora, deletar de fato
        await this.eventRepository.delete(eventId);
    }
}
