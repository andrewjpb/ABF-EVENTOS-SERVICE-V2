import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EventRepository } from './event.repository';
import { EventUtils } from './util/event.utils';
import { SponsorModule } from '../sponsor/sponsor.module';
import { SupporterModule } from '../supporter/supporter.module';

@Module({
    imports: [PrismaModule, SponsorModule, SupporterModule],
    controllers: [EventController],
    providers: [EventService, EventRepository, EventUtils],
    exports: [EventService],
})
export class EventModule {}
