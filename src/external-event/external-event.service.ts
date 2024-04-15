import { Injectable } from '@nestjs/common';
import { ExternalEventRepository } from './external-event.repository';
import { Result } from '../../shared/result/result.model';
import { AlreadyExistsError } from '../../shared/errors/already-exists.error';
import { ExternalEvent } from '@prisma/client';
import { EntityNotFoundError } from '../../shared/errors/entity-not-found.error';
import { CustomLogger } from '../log/custom.logger';
import { CreateExternalEventDto } from './dto/create-external-event.dto';
import { UpdateExternalEventDto } from './dto/update-external-event.dto';

@Injectable()
export class ExternalEventService {
    private readonly logger = CustomLogger.getLogger(ExternalEventService.name);

    constructor(private externalEventRepository: ExternalEventRepository) {}

    async create(createExternalEventDto: CreateExternalEventDto): Promise<Result> {
        this.logger.info('persisting new external event');

        const alreadyExists = await this.externalEventRepository.findByTitle(createExternalEventDto.title);

        if (alreadyExists) {
            const message = `já existe um evento externo com esse nome`;
            this.logger.error(message);
            return new Result(message, null, new AlreadyExistsError(message));
        }

        try {
            const externalEvent = await this.externalEventRepository.create(createExternalEventDto);
            this.logger.info(`evento externo criado com sucesso, id: ${externalEvent.id}`);
            return new Result('evento externo criado com sucesso', externalEvent, null);
        } catch (error) {
            return new Result(error.message, null, error);
        }
    }

    async count(): Promise<number> {
        return await this.externalEventRepository.count();
    }

    async findAll(skip: number, take: number): Promise<ExternalEvent[]> {
        this.logger.info(`listing external events, offset: ${skip} - limit: ${take}`);
        const externalEvents = await this.externalEventRepository.listAll(skip, take);
        this.logger.info(`external events found: ${externalEvents.length}`);
        return externalEvents;
    }

    async findById(id: string): Promise<ExternalEvent> {
        this.logger.info(`searching database for external event id "${id}"`);
        const externalEvent = await this.externalEventRepository.findById(id);
        if (!externalEvent) {
            this.logger.error('evento externo não econtrado');
            return null;
        }
        this.logger.info(`evento externo "${externalEvent.title}" found for id "${id}"`);
        return externalEvent;
    }

    async findByName(title: string): Promise<ExternalEvent> {
        this.logger.info(`searching database for external event title "${title}"`);
        const externalEvent = await this.externalEventRepository.findByTitle(title);
        if (!externalEvent) {
            this.logger.error('evento externo não encontrado');
            return null;
        }
        this.logger.info(`external event "${externalEvent.id}" found for name "${title}"`);
        return externalEvent;
    }

    async updateImageUrl(sponsorId: string, imagePath: string, imageUrl?: string, thumbUrl?: string) {
        const externalEvent = await this.externalEventRepository.findById(sponsorId);
        externalEvent.image_url = imageUrl ? imageUrl : externalEvent.image_url;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { created_at, updatedAt, id, ...updateExternalEventDto } = externalEvent;
        await this.update(sponsorId, updateExternalEventDto);
        this.logger.info(`external event image successfully updated on database`);
    }

    async update(id: string, updateExternalEventDto: UpdateExternalEventDto) {
        this.logger.info(`updating external event "${id}"`);
        const externalEventById = await this.findById(id);
        const externalEventByName = await this.findByName(updateExternalEventDto.title);
        if (!externalEventById) {
            const message = 'evento externo não encontrado';
            this.logger.error(message);
            return new Result(message, null, new EntityNotFoundError(message));
        } else if (externalEventByName && externalEventByName.id !== id) {
            const message = 'já existe um evento usando esse título';
            return new Result(message, null, new EntityNotFoundError(message));
        }
        const updatedExternalEvent = await this.externalEventRepository.update(id, updateExternalEventDto);
        const message = `external event "${updatedExternalEvent.id}" successfully updated`;
        this.logger.info(message);
        return new Result(message, updatedExternalEvent, null);
    }

    async remove(id: string): Promise<Result> {
        this.logger.info(`removing externalEvent "${id}"`);
        const externalEvent = await this.findById(id);
        if (!externalEvent) {
            const message = 'erro ao remover evento externo';
            this.logger.error(message);
            return new Result(message, null, new EntityNotFoundError(message));
        }
        const removedExternalEvent = await this.externalEventRepository.delete(id);
        const message = 'evento externo removido com sucesso;';
        this.logger.info(message);
        return new Result(message, removedExternalEvent, null);
    }
}
