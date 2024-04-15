import { Module } from '@nestjs/common';
import { MailJob } from './mail-job/mailJob';
import { BullModule } from '@nestjs/bull';
import { EmailModule } from '../email/email.module';
import { JobConstants } from './job.constants';
import { JobService } from './job.service';

@Module({
    imports: [
        EmailModule,
        BullModule.forRoot({
            redis: {
                host: process.env.REDIS_URL,
                port: Number(process.env.REDIS_PORT),
                db: Number(process.env.REDIS_DB),
            },
        }),
        BullModule.registerQueue({
            name: JobConstants.queues.mail,
        }),
    ],
    providers: [JobService, MailJob],
    exports: [JobService, MailJob],
})
export class JobModule {}
