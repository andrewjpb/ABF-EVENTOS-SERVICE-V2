import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ExternalEventRepository } from './external-event.repository';
import { ExternalEventService } from './external-event.service';
import { ExternalEventController } from './external-event.controller';

@Module({
    imports: [PrismaModule],
    providers: [ExternalEventRepository, ExternalEventService],
    controllers: [ExternalEventController],
})
export class ExternalEventModule {}
