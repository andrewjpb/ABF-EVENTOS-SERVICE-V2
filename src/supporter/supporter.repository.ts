import { PrismaService } from '../prisma/prisma.service';
import { CreateSupporterDto } from './dto/create-supporter.dto';
import { Supporter } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { UpdateSupporterDto } from './dto/update-supporter.dto';
import { CustomLogger } from '../log/custom.logger';

@Injectable()
export class SupporterRepository {
    private readonly logger = CustomLogger.getLogger(SupporterRepository.name);

    constructor(private prisma: PrismaService) {}

    async create(createSupporterDto: CreateSupporterDto): Promise<Supporter> {
        return this.prisma.supporter.create({
            data: {
                name: createSupporterDto.name,
                image_url: createSupporterDto.image_url,
                thumb_url: createSupporterDto.thumb_url,
            },
        });
    }

    async findById(id: string): Promise<any> {
        const supporter = await this.prisma.supporter.findUnique({
            where: {
                id,
            },
        });

        if (!supporter) {
            this.logger.error(`supporter "${id}" not found`);
            return null;
        }

        return supporter;
    }

    async findByName(name: string): Promise<Supporter> {
        const supporter = await this.prisma.supporter.findUnique({
            where: {
                name,
            },
        });

        if (!supporter) {
            this.logger.error(`supporter "${name}" not found`);
            return null;
        }

        return supporter;
    }

    async count(): Promise<number> {
        return this.prisma.supporter.count();
    }

    async listAll(skip: number, take: number): Promise<Supporter[]> {
        return this.prisma.supporter.findMany({
            skip,
            take,
        });
    }

    async update(id: string, updateSupporterDTO: UpdateSupporterDto): Promise<Supporter> {
        return this.prisma.supporter.update({
            where: { id },
            data: {
                name: updateSupporterDTO.name,
                image_url: updateSupporterDTO.image_url,
                thumb_url: updateSupporterDTO.thumb_url,
                image_path: updateSupporterDTO.image_path,
                thumb_path: updateSupporterDTO.thumb_path,
            },
        });
    }

    async delete(id: string): Promise<{ id: string; name: string }> {
        const deletedSupporter = await this.prisma.supporter.delete({
            where: { id },
        });

        return {
            id: deletedSupporter.id,
            name: deletedSupporter.name,
        };
    }
}
