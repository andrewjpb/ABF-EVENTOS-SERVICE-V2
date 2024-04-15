import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { EmailService } from '../../email/email.service';
import { JobConstants } from '../job.constants';
import { CustomLogger } from '../../log/custom.logger';
import { EmailDto } from '../../email/dto/email.dto';

@Processor(JobConstants.queues.mail)
export class MailJob {
    private readonly logger = CustomLogger.getLogger(MailJob.name);
    private static readonly EMAIL_EVENT = JobConstants.jobs.mail.event;

    constructor(
        @InjectQueue(JobConstants.queues.mail) private emailQueue: Queue,
        private readonly emailService: EmailService,
    ) {}

    async pushEmailJob(emailDto: EmailDto) {
        await this.emailQueue.add(MailJob.EMAIL_EVENT, emailDto);
        this.logger.info(`event ${MailJob.EMAIL_EVENT} added to job queue`);
    }

    @Process(MailJob.EMAIL_EVENT)
    async processWelcomeMail(job: Job): Promise<void> {
        try {
            const emailDto: EmailDto = job.data;
            this.logger.info(`handling email job for user ${emailDto.destinatary}`);
            await this.emailService.sendMail(emailDto.destinatary, emailDto.subject, emailDto.body);
            this.logger.info(`email job successfully processed`);
        } catch (error) {
            this.logger.error(`error: ${error.message}`);
        }
    }
}
