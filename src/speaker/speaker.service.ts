import { Injectable } from '@nestjs/common';
import { CreateSpeakerDto } from './dto/create-speaker.dto';
import { UpdateSpeakerDto } from './dto/update-speaker.dto';
import { SpeakerRepository } from './speaker.repository';
import { Result } from '../../shared/result/result.model';
import { SpeakerConstants } from './speaker-constants';
import { AlreadyExistsError } from '../../shared/errors/already-exists.error';
import { Speaker } from '@prisma/client';
import { EntityNotFoundError } from '../../shared/errors/entity-not-found.error';
import { CustomLogger } from '../log/custom.logger';

@Injectable()
export class SpeakerService {
    private readonly logger = CustomLogger.getLogger(SpeakerService.name);

    constructor(private speakerRepo: SpeakerRepository) {}

    async create(createSpeakerDto: CreateSpeakerDto): Promise<Result> {
        this.logger.info('persisting new speaker');
        const alreadyExists = await this.speakerRepo.findByName(createSpeakerDto.name);
        if (alreadyExists) {
            const message = `${SpeakerConstants.errors.notFoundError}: ${createSpeakerDto.name}`;
            this.logger.error(message);
            return new Result(
                SpeakerConstants.errors.alreadyExistsError.toString(),
                null,
                new AlreadyExistsError(message),
            );
        }

        try {
            const speaker = await this.speakerRepo.create(createSpeakerDto);
            this.logger.info(`speaker successfully persisted, id: ${speaker.id}`);
            return new Result(SpeakerConstants.messages.creationSuccess.toString(), speaker, null);
        } catch (error) {
            return new Result(error.message, null, error);
        }
    }

    async count(): Promise<number> {
        return await this.speakerRepo.count();
    }

    async findAll(skip: number, take: number): Promise<Speaker[]> {
        this.logger.info(`listing speakers, offset: ${skip} - limit: ${take}`);
        const speakers = await this.speakerRepo.listAll(skip, take);
        this.logger.info(`speakers found: ${speakers.length}`);
        return speakers;
    }

    async findById(id: string): Promise<Speaker> {
        this.logger.info(`searching database for speaker id "${id}"`);
        const speaker = await this.speakerRepo.findById(id);
        if (!speaker) {
            this.logger.error(SpeakerConstants.errors.notFoundError);
            return null;
        }
        this.logger.info(`speaker "${speaker.name}" found for id "${id}"`);
        return speaker;
    }

    async findByName(name: string): Promise<Speaker> {
        this.logger.info(`searching database for speaker name "${name}"`);
        const speaker = await this.speakerRepo.findByName(name);
        if (!speaker) {
            this.logger.error(SpeakerConstants.errors.notFoundError);
            return null;
        }
        this.logger.info(`speaker "${speaker.id}" found for name "${name}"`);
        return speaker;
    }

    async updateImageUrl(speakerId: string, imagePath: string, imageUrl?: string, thumbUrl?: string) {
        const speaker = await this.speakerRepo.findById(speakerId);
        speaker.image_url = imageUrl ? imageUrl : speaker.image_url;
        speaker.image_path = imageUrl ? imagePath : speaker.image_path;
        speaker.thumb_url = thumbUrl ? thumbUrl : speaker.thumb_url;
        speaker.thumb_path = thumbUrl ? imagePath : speaker.thumb_path;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { created_at, updatedAt, id, ...speakerUpdateDto } = speaker;
        await this.update(speakerId, speakerUpdateDto);
        this.logger.info(`speaker images successfully updated on database`);
    }

    async update(id: string, updateSpeakerDto: UpdateSpeakerDto) {
        this.logger.info(`updating user "${id}"`);
        const speakerById = await this.findById(id);
        const speakerByName = await this.findByName(updateSpeakerDto.name);
        if (!speakerById) {
            this.logger.error(SpeakerConstants.errors.updateError);
            return new Result(
                SpeakerConstants.errors.updateError.toString(),
                null,
                new EntityNotFoundError(SpeakerConstants.errors.notFoundError),
            );
        } else if (speakerByName && speakerByName.id !== id) {
            return new Result(
                SpeakerConstants.errors.nameAlreadyInUse.toString(),
                null,
                new EntityNotFoundError(SpeakerConstants.errors.nameAlreadyInUse),
            );
        }
        const updatedSpeaker = await this.speakerRepo.update(id, updateSpeakerDto);
        this.logger.info(`speaker "${updatedSpeaker.id}" successfully updated`);
        return new Result(SpeakerConstants.messages.updateSuccess, updatedSpeaker, null);
    }

    async remove(id: string): Promise<Result> {
        this.logger.info(`removing user "${id}"`);
        const speaker = await this.findById(id);
        if (!speaker) {
            this.logger.error(SpeakerConstants.errors.updateError);
            return new Result(
                SpeakerConstants.errors.deleteError.toString(),
                null,
                new EntityNotFoundError(SpeakerConstants.errors.deleteError),
            );
        }
        const removedSpeaker = await this.speakerRepo.delete(id);
        this.logger.info(SpeakerConstants.messages.deleteSuccess);
        return new Result(SpeakerConstants.messages.updateSuccess, removedSpeaker, null);
    }
}
