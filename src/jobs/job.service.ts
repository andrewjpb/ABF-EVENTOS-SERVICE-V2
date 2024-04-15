import { Injectable } from '@nestjs/common';
import { MailJob } from './mail-job/mailJob';
import { EmailService } from '../email/email.service';

@Injectable()
export class JobService {
    constructor(
        private readonly emailService: EmailService,
        private readonly mailJob: MailJob,
    ) {}

    public async pushWelcomeEmailJob(name: string, email: string) {
        await this.mailJob.pushEmailJob(this.emailService.getWelcomeEmailDto(name, email));
    }

    async pushResetPassEmailJob(name: string, email: string, token: string) {
        await this.mailJob.pushEmailJob(this.emailService.getResetEmailDto(name, email, token));
    }

    async pushEventReminderEmailJob(payload: { name: string; email: string; eventTitle: string }) {
        await this.mailJob.pushEmailJob(this.emailService.getEventReminderEmailDto(payload));
    }

    async pushCheckInEmailJob(name: string, email: string, qrCode: string) {
        await this.mailJob.pushEmailJob(this.emailService.getCheckInEmailDto(name, email, qrCode));
    }

    //TODO - check if the event subscription email is working
    async pushSubscriptionEmailJob({
        ...payload
    }: {
        name: string;
        email: string;
        eventTitle: string;
        eventDate: string;
        address: string;
        eventType: string;
        link: string;
        schedule_link: string;
        sponsors: Array<{ image: string; description: string }>;
    }) {
        await this.mailJob.pushEmailJob(this.emailService.getSubscriptionEmailDto({ ...payload }));
    }
}
