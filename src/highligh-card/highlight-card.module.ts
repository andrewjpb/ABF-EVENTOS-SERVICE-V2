import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { HighlightCardService } from './highlight-card-service';
import { HighlightCardController } from './highlight-card.controller';
import { HighlightCardRepository } from './highlight-card.repository';
import { DeleteHighlightCardController } from './v2/controller/deleteHighlightCard.controller';
import { DeleteHighlightCardService } from './v2/delete/deleteHighlightCard.service';
import { HighlightCardRepositoryV2 } from './repositories/highlight-card.repository';

@Module({
    imports: [PrismaModule],
    providers: [HighlightCardRepository, HighlightCardService, DeleteHighlightCardService, HighlightCardRepositoryV2],
    controllers: [HighlightCardController, DeleteHighlightCardController],
    exports: [HighlightCardService],
})
export class HighlightCardModule {}
