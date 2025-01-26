// src/highlight-card/repositories/highlight-card.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HighlightCard } from '@prisma/client';

@Injectable()
export class HighlightCardRepositoryV2 {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Busca um highlight card pelo id.
     */
    async findById(cardId: string): Promise<HighlightCard | null> {
        return this.prisma.highlightCard.findUnique({
            where: { id: cardId },
        });
    }

    /**
     * Deleta um highlight card pelo id.
     */
    async delete(cardId: string): Promise<void> {
        await this.prisma.highlightCard.delete({
            where: { id: cardId },
        });
    }
}
