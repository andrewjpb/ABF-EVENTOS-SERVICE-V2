import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EventModule } from '../event/event.module';
import { EventReminderScheduler } from './event-reminder.scheduler';
import { JobModule } from '../jobs/job.module';
import { CheckInModule } from '../check-in/check-in.module';

@Module({
    imports: [ScheduleModule.forRoot(), EventModule, JobModule, CheckInModule],
    providers: [EventReminderScheduler],
})
export class TaskModule {}
