import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailDto } from './dto/email.dto';
import { EmailConstants } from './email.constants';
import { EmailTemplate } from './templates/email.template';
import { CustomLogger } from '../log/custom.logger';
import { EventTypeEnum } from '../event/enum/event-type.enum';

@Injectable()
export class EmailService {
    private readonly logger = CustomLogger.getLogger(EmailService.name);

    constructor(private readonly mailService: MailerService) {}

    public async sendMail(destinatary: string, subject: string, body: string): Promise<void> {
        try {
            await this.mailService.sendMail({
                to: destinatary,
                from: process.env.SMTP_MASK,
                subject: subject,
                html: body,
            });
        } catch (error) {
            this.logger.error(`error sending email to: "${destinatary}"`);
        }
        this.logger.info(`email successfully sent to: "${destinatary}"`);
    }

    public getResetEmailDto(name: string, email: string, token: string): EmailDto {
        return new EmailDto(
            name,
            email,
            EmailConstants.subject.passwordReset,
            EmailTemplate.passReset.replaceAll('{{user}}', name).replaceAll('{{token}}', token),
        );
    }

    public getWelcomeEmailDto(name: string, email: string): EmailDto {
        return new EmailDto(
            name,
            email,
            EmailConstants.subject.welcomeEmail,
            EmailTemplate.welcome.replaceAll('{{user}}', name),
        );
    }

    public getEventReminderEmailDto(payload: { name: string; email: string; eventTitle: string }): EmailDto {
        return new EmailDto(
            payload.name,
            payload.email,
            EmailConstants.subject.eventReminder,
            EmailTemplate.eventReminder
                .replaceAll('{{event-title}}', payload.eventTitle)
                .replaceAll('{{user-name}}', payload.name),
        );
    }

    public getCheckInEmailDto(name: string, email: string, qrCode: string): EmailDto {
        return new EmailDto(
            name,
            email,
            EmailConstants.subject.checkIn,
            EmailTemplate.checkIn.replaceAll('{{qr-code}}', qrCode),
        );
    }

    public getSubscriptionEmailDto(payload: {
        name: string;
        email: string;
        eventTitle: string;
        eventDate: string;
        address: string;
        eventType: string;
        link: string;
        schedule_link: string;
        sponsors: Array<{ image: string; description: string }>;
    }): EmailDto {
        let template: string;
        switch (payload.eventType) {
            case EventTypeEnum.IN_PERSON.toString():
                template = EmailTemplate.eventSubscription.replaceAll('{{schedule_link}}', payload.schedule_link);
                break;
            case EventTypeEnum.ONLINE.toString():
                template = EmailTemplate.eventSubscriptionOnline
                    .replaceAll('{{transmission-link}}', payload.link)
                    .replaceAll('{{schedule_link}}', payload.schedule_link);
                break;
            case EventTypeEnum.HYBRID.toString():
                template = EmailTemplate.eventSubscriptionHybrid
                    .replaceAll('{{transmission-link}}', payload.link)
                    .replaceAll('{{schedule_link}}', payload.schedule_link)
                    .replaceAll('{{event-title}}', payload.eventTitle);
                break;
            case EventTypeEnum.EXTERNAL.toString():
                // TODO - adicionar template
                template = 'NO TEMPLATE';
                break;
        }
        const sponsorsTemplateMail = payload.sponsors.map(
            (sponsor) => `
                   <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 20px;">
    <tr>
        <td align="left">
            <img
                src="${sponsor.image}"
                width="140"
                alt="Eventos ABF"
                style="max-width: 100%; border: 0; outline: none; text-decoration: none; display: block;"
            />
        </td>
    </tr>
    <tr>
        <td style="line-height: 24px; margin-top: 5px;">
            ${sponsor.description}
        </td>
    </tr>
</table>

`,
        );
        const containerNameSponsors = () => {
            return `<div role="separator" style="background-color: #e2e8f0; height: 1px; line-height: 1px; margin: 32px 0">&zwj;</div>
                  
                              <strong
                      >Confira a solução dos nossos patrocinadores:</strong
                    >
`;
        };

        if (sponsorsTemplateMail.length > 0) {
            template = template.replaceAll('{{text-patrocinador}}', containerNameSponsors);
        } else {
            template = template.replaceAll('{{text-patrocinador}}', '');
        }

        return new EmailDto(
            payload.name,
            payload.email,
            EmailConstants.subject.eventSubscription,
            template
                .replaceAll('{{event-title}}', payload.eventTitle)
                .replaceAll('{{event-date}}', payload.eventDate)
                .replaceAll('{{event-address}}', payload.address)
                .replaceAll('{{user}}', payload.name)
                .replaceAll('{{container-patrocidadores}}', String(sponsorsTemplateMail).replaceAll(',', '')),
        );
    }
}
