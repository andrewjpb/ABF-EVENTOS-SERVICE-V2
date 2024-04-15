import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Sponsor } from '@prisma/client';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { UpdateSponsorDto } from './dto/update-sponsor.dto';
import { CustomLogger } from '../log/custom.logger';

@Injectable()
export class SponsorRepository {
    private readonly logger = CustomLogger.getLogger(SponsorRepository.name);

    constructor(private prisma: PrismaService) {}

    async create(createSponsorDto: CreateSponsorDto): Promise<Sponsor> {
        return this.prisma.sponsor.create({
            data: {
                name: createSponsorDto.name,
                image_url: createSponsorDto.image_url,
                thumb_url: createSponsorDto.thumb_url,
                description: createSponsorDto.description,
            },
        });
    }

    async findById(id: string): Promise<Sponsor> {
        const sponsor = await this.prisma.sponsor.findUnique({
            where: {
                id,
            },
        });

        if (!sponsor) {
            this.logger.error(`sponsor "${id}" not found`);
            return null;
        }

        return sponsor;
    }

    async findByName(name: string): Promise<Sponsor> {
        const sponsor = await this.prisma.sponsor.findUnique({
            where: {
                name,
            },
        });

        if (!sponsor) {
            this.logger.error(`sponsor "${name}" not found`);
            return null;
        }

        return sponsor;
    }

    async count(): Promise<number> {
        return this.prisma.sponsor.count();
    }

    async listAll(skip: number, take: number): Promise<Sponsor[]> {
        return this.prisma.sponsor.findMany({
            skip,
            take,
        });
    }

    async update(id: string, updateSponsorDto: UpdateSponsorDto): Promise<Sponsor> {
        return this.prisma.sponsor.update({
            where: { id },
            data: {
                name: updateSponsorDto.name,
                description: updateSponsorDto.description,
                image_url: updateSponsorDto.image_url,
                thumb_url: updateSponsorDto.thumb_url,
                image_path: updateSponsorDto.image_path,
                thumb_path: updateSponsorDto.thumb_path,
            },
        });
    }

    async delete(id: string): Promise<{ id: string; name: string }> {
        const deletedSponsor = await this.prisma.sponsor.delete({
            where: { id },
        });

        return {
            id: deletedSponsor.id,
            name: deletedSponsor.name,
        };
    }
}
