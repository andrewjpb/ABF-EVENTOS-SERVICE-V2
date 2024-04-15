import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { EventModule } from '../event/event.module';
import { UsersModule } from '../users/users.module';
import { ReportService } from './report.service';

@Module({
    imports: [EventModule, UsersModule],
    providers: [ReportService],
    controllers: [ReportController],
})
export class ReportModule {}
