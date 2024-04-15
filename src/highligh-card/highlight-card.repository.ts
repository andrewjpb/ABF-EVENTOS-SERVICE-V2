import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { HighlightCard } from '@prisma/client';
import { CustomLogger } from '../log/custom.logger';
import { CreateHighlightCardDto } from './dtos/create-highlight-card.dto';
import { UpdateHighlightCardDto } from './dtos/update-highlight-card.dto';

@Injectable()
export class HighlightCardRepository {
    private readonly logger = CustomLogger.getLogger(HighlightCardRepository.name);

    constructor(private prisma: PrismaService) {}

    async create(createHighlightCardDto: CreateHighlightCardDto): Promise<HighlightCard> {
        return this.prisma.highlightCard.create({
            data: {
                title: createHighlightCardDto.title,
                image_url: createHighlightCardDto.image_url,
                external_link: createHighlightCardDto.external_link,
                active: createHighlightCardDto.active,
            },
        });
    }

    async findById(id: string): Promise<HighlightCard> {
        const highlightCard = await this.prisma.highlightCard.findUnique({
            where: {
                id,
            },
        });

        if (!highlightCard) {
            this.logger.error(`card "${id}" not found`);
            return null;
        }

        return highlightCard;
    }

    async findByName(title: string): Promise<HighlightCard> {
        const card = await this.prisma.highlightCard.findFirst({
            where: {
                title,
            },
        });

        if (!card) {
            this.logger.error(`card "${title}" not found`);
            return null;
        }

        return card;
    }

    async count(): Promise<number> {
        return this.prisma.highlightCard.count();
    }

    async listAll(skip: number, take: number): Promise<HighlightCard[]> {
        return this.prisma.highlightCard.findMany({
            skip,
            take,
        });
    }

    async update(id: string, updateHighlightCardDto: UpdateHighlightCardDto): Promise<HighlightCard> {
        return this.prisma.highlightCard.update({
            where: { id },
            data: updateHighlightCardDto,
        });
    }

    async delete(id: string): Promise<{ id: string; title: string }> {
        const deletedCard = await this.prisma.highlightCard.delete({
            where: { id },
        });

        return {
            id: deletedCard.id,
            title: deletedCard.title,
        };
    }
}
