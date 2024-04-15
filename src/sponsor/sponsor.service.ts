import { Injectable } from '@nestjs/common';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { UpdateSponsorDto } from './dto/update-sponsor.dto';
import { SponsorRepository } from './sponsor.repository';
import { Result } from '../../shared/result/result.model';
import { AlreadyExistsError } from '../../shared/errors/already-exists.error';
import { Sponsor } from '@prisma/client';
import { EntityNotFoundError } from '../../shared/errors/entity-not-found.error';
import { SponsorConstants } from './sponsor-constants';
import { CustomLogger } from '../log/custom.logger';

@Injectable()
export class SponsorService {
    private readonly logger = CustomLogger.getLogger(SponsorService.name);

    constructor(private sponsorRepo: SponsorRepository) {}

    async create(createSponsorDto: CreateSponsorDto): Promise<Result> {
        this.logger.info('persisting new sponsor');

        const alreadyExists = await this.sponsorRepo.findByName(createSponsorDto.name);

        if (alreadyExists) {
            const message = `${SponsorConstants.errors.notFoundError}: ${createSponsorDto.name}`;
            this.logger.error(message);
            return new Result(
                SponsorConstants.errors.alreadyExistsError.toString(),
                null,
                new AlreadyExistsError(message),
            );
        }

        try {
            const sponsor = await this.sponsorRepo.create(createSponsorDto);
            this.logger.info(`sponsor successfully persisted, id: ${sponsor.id}`);
            return new Result(SponsorConstants.messages.creationSuccess.toString(), sponsor, null);
        } catch (error) {
            return new Result(error.message, null, error);
        }
    }

    async count(): Promise<number> {
        return await this.sponsorRepo.count();
    }

    async findAll(skip: number, take: number): Promise<Sponsor[]> {
        this.logger.info(`listing sponsors, offset: ${skip} - limit: ${take}`);
        const sponsors = await this.sponsorRepo.listAll(skip, take);
        this.logger.info(`sponsors found: ${sponsors.length}`);
        return sponsors;
    }

    async findById(id: string): Promise<Sponsor> {
        this.logger.info(`searching database for sponsor id "${id}"`);
        const sponsor = await this.sponsorRepo.findById(id);
        if (!sponsor) {
            this.logger.error(SponsorConstants.errors.notFoundError);
            return null;
        }
        this.logger.info(`sponsor "${sponsor.name}" found for id "${id}"`);
        return sponsor;
    }

    async findByName(name: string): Promise<Sponsor> {
        this.logger.info(`searching database for sponsor name "${name}"`);
        const sponsor = await this.sponsorRepo.findByName(name);
        if (!sponsor) {
            this.logger.error(SponsorConstants.errors.notFoundError);
            return null;
        }
        this.logger.info(`sponsor "${sponsor.id}" found for name "${name}"`);
        return sponsor;
    }

    async updateImageUrl(sponsorId: string, imagePath: string, imageUrl?: string, thumbUrl?: string) {
        const sponsor = await this.sponsorRepo.findById(sponsorId);
        sponsor.image_url = imageUrl ? imageUrl : sponsor.image_url;
        sponsor.image_path = imageUrl ? imagePath : sponsor.image_path;
        sponsor.thumb_url = thumbUrl ? thumbUrl : sponsor.thumb_url;
        sponsor.thumb_path = thumbUrl ? imagePath : sponsor.thumb_path;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { created_at, updatedAt, id, ...sponsorUpdateDto } = sponsor;
        await this.update(sponsorId, sponsorUpdateDto);
        this.logger.info(`sponsor images successfully updated on database`);
    }

    async update(id: string, updateSponsorDto: UpdateSponsorDto) {
        this.logger.info(`updating user "${id}"`);
        const sponsorById = await this.findById(id);
        const sponsorByName = await this.findByName(updateSponsorDto.name);
        if (!sponsorById) {
            this.logger.error(SponsorConstants.errors.updateError);
            return new Result(
                SponsorConstants.errors.updateError.toString(),
                null,
                new EntityNotFoundError(SponsorConstants.errors.notFoundError),
            );
        } else if (sponsorByName && sponsorByName.id !== id) {
            return new Result(
                SponsorConstants.errors.nameAlreadyInUse.toString(),
                null,
                new EntityNotFoundError(SponsorConstants.errors.nameAlreadyInUse),
            );
        }
        const updatedSponsor = await this.sponsorRepo.update(id, updateSponsorDto);
        this.logger.info(`sponsor "${updatedSponsor.id}" successfully updated`);
        return new Result(SponsorConstants.messages.updateSuccess, updatedSponsor, null);
    }

    async remove(id: string): Promise<Result> {
        this.logger.info(`removing user "${id}"`);
        const sponsor = await this.findById(id);
        if (!sponsor) {
            this.logger.error(SponsorConstants.errors.updateError);
            return new Result(
                SponsorConstants.errors.deleteError.toString(),
                null,
                new EntityNotFoundError(SponsorConstants.errors.deleteError),
            );
        }
        const removedSponsor = await this.sponsorRepo.delete(id);
        this.logger.info(SponsorConstants.messages.deleteSuccess);
        return new Result(SponsorConstants.messages.updateSuccess, removedSponsor, null);
    }
}
