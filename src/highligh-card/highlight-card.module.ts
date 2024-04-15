import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { HighlightCardService } from './highlight-card-service';
import { HighlightCardController } from './highlight-card.controller';
import { HighlightCardRepository } from './highlight-card.repository';

@Module({
    imports: [PrismaModule],
    providers: [HighlightCardRepository, HighlightCardService],
    controllers: [HighlightCardController],
    exports: [HighlightCardService],
})
export class HighlightCardModule {}
