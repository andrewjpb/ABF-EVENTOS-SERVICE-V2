import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { EventModule } from './event/event.module';
import { SpeakerModule } from './speaker/speaker.module';
import { SponsorModule } from './sponsor/sponsor.module';
import { SupporterModule } from './supporter/supporter.module';
import { AddressModule } from './address/address.module';
import { EmailModule } from './email/email.module';
import { PermissionModule } from './permission/permission.module';
import { FileModule } from './files/file.module';
import { TaskModule } from './task/task.module';
import { LogModule } from './log/log.module';
import { RequestMetricsMiddleware } from '../shared/middleware/request-metrics.middleware';
import { ReportModule } from './report/report.module';
import { CheckInModule } from './check-in/check-in.module';
import { HighlightCardModule } from './highligh-card/highlight-card.module';
import { ExternalEventModule } from './external-event/external-event.module';

@Module({
    imports: [
        LogModule,
        UsersModule,
        PrismaModule,
        AuthModule,
        RoleModule,
        EventModule,
        SpeakerModule,
        SponsorModule,
        SupporterModule,
        AddressModule,
        EmailModule,
        PermissionModule,
        FileModule,
        TaskModule,
        ReportModule,
        CheckInModule,
        HighlightCardModule,
        ExternalEventModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestMetricsMiddleware).forRoutes('*');
    }
}
