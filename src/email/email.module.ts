import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: process.env.SMTP_HOST,
                ignoreTLS: false,
                secure: false,
                port: Number(process.env.SMTP_PORT),
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD,
                },
            },
        }),
    ],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule {}
