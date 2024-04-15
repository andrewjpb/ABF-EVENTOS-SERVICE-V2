import { Injectable } from '@nestjs/common';
import { Result } from '../../shared/result/result.model';
import { AlreadyExistsError } from '../../shared/errors/already-exists.error';
import { HighlightCard } from '@prisma/client';
import { EntityNotFoundError } from '../../shared/errors/entity-not-found.error';
import { CustomLogger } from '../log/custom.logger';
import { CreateHighlightCardDto } from './dtos/create-highlight-card.dto';
import { HighlightCardRepository } from './highlight-card.repository';
import { UpdateHighlightCardDto } from './dtos/update-highlight-card.dto';

@Injectable()
export class HighlightCardService {
    private readonly logger = CustomLogger.getLogger(HighlightCardService.name);

    constructor(private cardRepo: HighlightCardRepository) {}

    async create(createHighlightCardDto: CreateHighlightCardDto): Promise<Result> {
        this.logger.info('persisting new card');

        const alreadyExists = await this.cardRepo.findByName(createHighlightCardDto.title);

        if (alreadyExists) {
            const message = `já existe um card com esse título`;
            this.logger.error(message);
            return new Result(message, null, new AlreadyExistsError(message));
        }

        try {
            const card = await this.cardRepo.create(createHighlightCardDto);
            const message = `card criado com sucesso, id: ${card.id}`;
            this.logger.info(message);
            return new Result(message, card, null);
        } catch (error) {
            return new Result(error.message, null, error);
        }
    }

    async count(): Promise<number> {
        return await this.cardRepo.count();
    }

    async findAll(skip: number, take: number): Promise<HighlightCard[]> {
        this.logger.info(`listing cards, offset: ${skip} - limit: ${take}`);
        const cards = await this.cardRepo.listAll(skip, take);
        this.logger.info(`cards found: ${cards.length}`);
        return cards;
    }

    async findById(id: string): Promise<HighlightCard> {
        this.logger.info(`searching database for card id "${id}"`);
        const card = await this.cardRepo.findById(id);
        if (!card) {
            this.logger.error('card não encontrado');
            return null;
        }
        this.logger.info(`card "${card.title}" found for id "${id}"`);
        return card;
    }

    async findByName(title: string): Promise<HighlightCard> {
        this.logger.info(`searching database for card title "${title}"`);
        const card = await this.cardRepo.findByName(title);
        if (!card) {
            this.logger.error('card não encontrado');
            return null;
        }
        this.logger.info(`card "${card.id}" found for name "${title}"`);
        return card;
    }

    async updateImageUrl(cardId: string, imagePath: string, imageUrl?: string, thumbUrl?: string) {
        const card = await this.cardRepo.findById(cardId);
        card.image_url = imageUrl ? imageUrl : card.image_url;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { created_at, updatedAt, id, ...cardUpdateDto } = card;
        await this.update(cardId, cardUpdateDto);
        this.logger.info(`card image successfully updated on database`);
    }

    async update(id: string, updateHighlightCardDto: UpdateHighlightCardDto) {
        this.logger.info(`updating card "${id}"`);
        const cardById = await this.findById(id);
        const cardByTitle = await this.findByName(updateHighlightCardDto.title);
        if (!cardById) {
            const message = 'card não encontrado';
            this.logger.error(message);
            return new Result(message, null, new EntityNotFoundError(message));
        } else if (cardByTitle && cardByTitle.id !== id) {
            const message = 'já existe um card com esse título';
            return new Result(message, null, new EntityNotFoundError(message));
        }
        const updatedCard = await this.cardRepo.update(id, updateHighlightCardDto);
        const message = `card "${updatedCard.id}" successfully updated`;
        this.logger.info(message);
        return new Result(message, updatedCard, null);
    }

    async remove(id: string): Promise<Result> {
        this.logger.info(`removing card "${id}"`);
        const card = await this.findById(id);
        if (!card) {
            const message = 'erro ao atualizar o card';
            this.logger.error(message);
            return new Result(message, null, new EntityNotFoundError(message));
        }
        const removedCard = await this.cardRepo.delete(id);
        const message = 'card removido com sucesso';
        this.logger.info(message);
        return new Result(message, removedCard, null);
    }
}
