import { Module } from '@nestjs/common';
import { SponsorService } from './sponsor.service';
import { SponsorController } from './sponsor.controller';
import { SponsorRepository } from './sponsor.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [SponsorController],
    providers: [SponsorService, SponsorRepository],
    exports: [SponsorService],
})
export class SponsorModule {}
