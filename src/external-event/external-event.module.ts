import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ExternalEventRepository } from './external-event.repository';
import { ExternalEventService } from './external-event.service';
import { ExternalEventController } from './external-event.controller';
import { DeleteExternalEventController } from './v2/delete/controller/deleteExternalEvent.controller';
import { DeleteExternalEventService } from './v2/delete/services/deleteExternalEvent.service';
import { ExternalEventRepositoryV2 } from './repositories/prisma.repository';

@Module({
    imports: [PrismaModule],
    providers: [ExternalEventRepository, ExternalEventService, DeleteExternalEventService, ExternalEventRepositoryV2],
    controllers: [ExternalEventController, DeleteExternalEventController],
})
export class ExternalEventModule {}
