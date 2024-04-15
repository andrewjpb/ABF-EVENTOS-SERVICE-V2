import { Module } from '@nestjs/common';
import { SpeakerService } from './speaker.service';
import { SpeakerController } from './speaker.controller';
import { SpeakerRepository } from './speaker.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [SpeakerController],
    providers: [SpeakerService, SpeakerRepository],
    exports: [SpeakerService],
})
export class SpeakerModule {}
