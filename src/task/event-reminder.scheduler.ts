import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventService } from '../event/event.service';
import { JobService } from '../jobs/job.service';
import { AttendanceList, User } from '@prisma/client';
import { CustomLogger } from '../log/custom.logger';
import { CheckInService } from '../check-in/check-in.service';
import * as process from 'process';

@Injectable()
export class EventReminderScheduler {
    private readonly logger = CustomLogger.getLogger(EventReminderScheduler.name);

    constructor(
        private readonly eventService: EventService,
        private readonly jobService: JobService,
        private readonly checkInService: CheckInService,
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async run(): Promise<void> {
        this.logger.info('starting event reminder task...');
        let skip = 0;
        const take = Number(process.env.JOB_EVENT_REMINDER_EVENT_BATCH_SIZE);
        let events = await this.eventService.listNextEvents(skip, take);
        while (events.length > 0) {
            this.logger.info(`events batch size: ${events.length}`);
            for (const event of events) {
                await this.buildAttendeeList(event.id, event.title);
            }
            skip += take;
            events = await this.eventService.listNextEvents(skip, take);
        }
        this.logger.info('reminder successfully scheduled for all upcoming events');
    }

    private async buildAttendeeList(eventId: string, eventTitle: string) {
        let skip = 0;
        const take = Number(process.env.JOB_EVENT_REMINDER_ATTENDEE_BATCH_SIZE);
        let attendanceLists: AttendanceList[] = await this.checkInService.attendanceByEvent(eventId, skip, take);
        while (attendanceLists.length > 0) {
            this.logger.info(`attendance list batch size: ${attendanceLists.length}`);
            for (const attendanceList of attendanceLists) {
                const name = attendanceList.attendee_full_name;
                const email = attendanceList.attendee_email;
                await this.informUsers({ name, email }, eventTitle);
            }
            skip += take;
            attendanceLists = await this.checkInService.attendanceByEvent(eventId, skip, take);
        }
    }

    private async informUsers(attendee: { name: string; email: string }, eventTitle: string): Promise<void> {
        await this.pushJob(attendee.name, attendee.email, eventTitle);
    }

    private async pushJob(name: string, email: string, eventTitle: string): Promise<void> {
        await this.jobService.pushEventReminderEmailJob({
            name,
            email,
            eventTitle,
        });
    }
}
