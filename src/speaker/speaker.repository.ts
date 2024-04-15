import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateSpeakerDto } from './dto/create-speaker.dto';
import { Speaker } from '@prisma/client';
import { UpdateSpeakerDto } from './dto/update-speaker.dto';
import { CustomLogger } from '../log/custom.logger';

@Injectable()
export class SpeakerRepository {
    private readonly logger = CustomLogger.getLogger(SpeakerRepository.name);

    constructor(private prisma: PrismaService) {}

    async create(createSpeakerDto: CreateSpeakerDto): Promise<Speaker> {
        return this.prisma.speaker.create({
            data: {
                name: createSpeakerDto.name,
                image_url: createSpeakerDto.image_url,
                thumb_url: createSpeakerDto.thumb_url,
            },
        });
    }

    async findById(id: string): Promise<Speaker> {
        const speaker = await this.prisma.speaker.findUnique({
            where: {
                id,
            },
        });

        if (!speaker) {
            this.logger.error(`speaker "${id}" not found`);
            return null;
        }
        return speaker;
    }

    async findByName(name: string): Promise<Speaker> {
        const speaker = await this.prisma.speaker.findUnique({
            where: {
                name,
            },
        });

        if (!speaker) {
            this.logger.error(`speaker "${name}" not found`);
            return null;
        }

        return speaker;
    }

    async count(): Promise<number> {
        return this.prisma.speaker.count();
    }

    async listAll(skip: number, take: number): Promise<Speaker[]> {
        return this.prisma.speaker.findMany({
            skip,
            take,
        });
    }

    async update(id: string, updateSpeakerDto: UpdateSpeakerDto): Promise<Speaker> {
        return this.prisma.speaker.update({
            where: { id },
            data: {
                name: updateSpeakerDto.name,
                image_url: updateSpeakerDto.image_url,
                thumb_url: updateSpeakerDto.thumb_url,
                image_path: updateSpeakerDto.image_path,
                thumb_path: updateSpeakerDto.thumb_path,
            },
        });
    }

    async delete(id: string): Promise<{ id: string; name: string }> {
        const deletedSpeaker = await this.prisma.speaker.delete({
            where: { id },
        });

        return {
            id: deletedSpeaker.id,
            name: deletedSpeaker.name,
        };
    }
}
