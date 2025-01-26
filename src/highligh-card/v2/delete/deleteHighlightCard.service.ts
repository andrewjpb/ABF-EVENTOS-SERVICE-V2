// src/highlight-card/v2/delete/deleteHighlightCard.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { HighlightCardRepositoryV2 } from 'src/highligh-card/repositories/highlight-card.repository';

@Injectable()
export class DeleteHighlightCardService {
    constructor(private readonly highlightCardRepository: HighlightCardRepositoryV2) {}

    async execute(cardId: string): Promise<void> {
        const card = await this.highlightCardRepository.findById(cardId);
        if (!card) {
            throw new NotFoundException('Highlight Card não encontrado');
        }

        // Se quiser mais validações (ex: se está em uso em outro lugar), faça aqui

        await this.highlightCardRepository.delete(cardId);
    }
}
