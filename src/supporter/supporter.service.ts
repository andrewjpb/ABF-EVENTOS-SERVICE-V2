import { Injectable } from '@nestjs/common';
import { CreateSupporterDto } from './dto/create-supporter.dto';
import { UpdateSupporterDto } from './dto/update-supporter.dto';
import { Supporter } from '@prisma/client';
import { SupporterRepository } from './supporter.repository';
import { Result } from '../../shared/result/result.model';
import { AlreadyExistsError } from '../../shared/errors/already-exists.error';
import { SupporterConstants } from './supporter-constants';
import { EntityNotFoundError } from '../../shared/errors/entity-not-found.error';
import { CustomLogger } from '../log/custom.logger';

@Injectable()
export class SupporterService {
    private readonly logger = CustomLogger.getLogger(SupporterService.name);

    constructor(private supporterRepo: SupporterRepository) {}

    async create(createSupporterDto: CreateSupporterDto): Promise<Result> {
        this.logger.info('persisting new supporter');
        const alreadyExists = await this.supporterRepo.findByName(createSupporterDto.name);
        if (alreadyExists) {
            const message = `${SupporterConstants.errors.notFoundError}: ${createSupporterDto.name}`;
            this.logger.error(message);
            return new Result(
                SupporterConstants.errors.alreadyExistsError.toString(),
                null,
                new AlreadyExistsError(message),
            );
        }

        try {
            const supporter = await this.supporterRepo.create(createSupporterDto);
            this.logger.info(`supporter successfully persisted, id: ${supporter.id}`);
            return new Result(SupporterConstants.messages.creationSuccess.toString(), supporter, null);
        } catch (error) {
            return new Result(error.message, null, error);
        }
    }

    async count(): Promise<number> {
        return await this.supporterRepo.count();
    }

    async findAll(skip: number, take: number): Promise<Supporter[]> {
        this.logger.info(`listing supporters, offset: ${skip} - limit: ${take}`);
        const supporters = await this.supporterRepo.listAll(skip, take);
        this.logger.info(`supporters found: ${supporters.length}`);
        return supporters;
    }

    async findById(id: string): Promise<Supporter> {
        this.logger.info(`searching database for supporter id "${id}"`);
        const supporter = await this.supporterRepo.findById(id);
        if (!supporter) {
            this.logger.info(SupporterConstants.errors.notFoundError);
            return null;
        }
        this.logger.info(`supporter "${supporter.username}" found for id "${id}"`);
        return supporter;
    }

    async findByName(name: string): Promise<Supporter> {
        this.logger.info(`searching database for supporter name "${name}"`);
        const supporter = await this.supporterRepo.findByName(name);
        if (!supporter) {
            this.logger.error(SupporterConstants.errors.notFoundError);
            return null;
        }
        this.logger.info(`supporter "${supporter.id}" found for name "${name}"`);
        return supporter;
    }

    async updateImageUrl(supporterId: string, imagePath: string, imageUrl?: string, thumbUrl?: string) {
        const supporter = await this.supporterRepo.findById(supporterId);
        supporter.image_url = imageUrl ? imageUrl : supporter.image_url;
        supporter.image_path = imageUrl ? imagePath : supporter.image_path;
        supporter.thumb_url = thumbUrl ? thumbUrl : supporter.thumb_url;
        supporter.thumb_path = thumbUrl ? imagePath : supporter.thumb_path;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { created_at, updatedAt, id, ...supporterUpdateDto } = supporter;
        await this.update(supporterId, supporterUpdateDto);
        this.logger.info(`supporter images successfully updated on database`);
    }

    async update(id: string, updateSupporterDto: UpdateSupporterDto) {
        this.logger.info(`updating user "${id}"`);
        const supporterById = await this.findById(id);
        const supporterByName = await this.findByName(updateSupporterDto.name);
        if (!supporterById) {
            this.logger.error(SupporterConstants.errors.updateError);
            return new Result(
                SupporterConstants.errors.updateError.toString(),
                null,
                new EntityNotFoundError(SupporterConstants.errors.notFoundError),
            );
        } else if (supporterByName && supporterByName.id !== id) {
            return new Result(
                SupporterConstants.errors.nameAlreadyInUse.toString(),
                null,
                new EntityNotFoundError(SupporterConstants.errors.nameAlreadyInUse),
            );
        }
        const updatedSupporter = await this.supporterRepo.update(id, updateSupporterDto);
        this.logger.info(`supporter "${updatedSupporter.id}" successfully updated`);
        return new Result(SupporterConstants.messages.updateSuccess, updatedSupporter, null);
    }

    async remove(id: string): Promise<Result> {
        this.logger.info(`removing user "${id}"`);
        const supporter = await this.findById(id);
        if (!supporter) {
            this.logger.error(SupporterConstants.errors.updateError);
            return new Result(
                SupporterConstants.errors.deleteError.toString(),
                null,
                new EntityNotFoundError(SupporterConstants.errors.deleteError),
            );
        }
        const removedSupporter = await this.supporterRepo.delete(id);
        this.logger.info(SupporterConstants.messages.deleteSuccess);
        return new Result(SupporterConstants.messages.updateSuccess, removedSupporter, null);
    }
}
