import { Module } from '@nestjs/common';
import { HighlightCardModule } from 'src/highligh-card/highlight-card.module';
import { EventModule } from '../event/event.module';
import { SpeakerModule } from '../speaker/speaker.module';
import { SponsorModule } from '../sponsor/sponsor.module';
import { SupporterModule } from '../supporter/supporter.module';
import { UsersModule } from '../users/users.module';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
    imports: [UsersModule, EventModule, SpeakerModule, SupporterModule, SponsorModule, HighlightCardModule],
    providers: [FileService],
    controllers: [FileController],
})
export class FileModule {}
