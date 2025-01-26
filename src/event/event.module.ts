import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EventRepository } from './event.repository';
import { EventUtils } from './util/event.utils';
import { SponsorModule } from '../sponsor/sponsor.module';
import { SupporterModule } from '../supporter/supporter.module';
import { EventRepositoryV2 } from './repository/prisma.repository';
import { DeleteEventController } from './v2/usecases/remove/controller/deleteEvent.controller';
import { DeleteEventService } from './v2/usecases/remove/services/deleteEvent.service';

@Module({
    imports: [PrismaModule, SponsorModule, SupporterModule],
    controllers: [EventController, DeleteEventController],
    providers: [EventService, EventRepository, EventUtils, EventRepositoryV2, DeleteEventService],
    exports: [EventService],
})
export class EventModule {}
