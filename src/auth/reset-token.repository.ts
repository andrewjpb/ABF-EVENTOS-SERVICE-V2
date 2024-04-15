import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResetTokenDto } from './dto/reset-token.dto';
import { ResetToken } from '@prisma/client';
import { CustomLogger } from '../log/custom.logger';

@Injectable()
export class ResetTokenRepository {
    private readonly logger = CustomLogger.getLogger(ResetTokenRepository.name);

    constructor(private readonly prisma: PrismaService) {}

    async create(tokenDto: ResetTokenDto): Promise<ResetToken> {
        const token = this.prisma.resetToken.create({
            data: {
                userId: tokenDto.userId,
                ttl: tokenDto.ttl,
                used: tokenDto.used,
            },
        });

        this.logger.info('reset token successfully created');

        return token;
    }

    async markAsUsed(tokenId: string): Promise<void> {
        await this.prisma.resetToken.update({
            where: { id: tokenId },
            data: {
                used: true,
            },
        });
    }

    async findById(id: string): Promise<ResetToken> {
        const token = this.prisma.resetToken.findUnique({
            where: { id },
        });

        if (!token) {
            this.logger.error('token not found');
        }

        return token;
    }
}
