import { Module } from '@nestjs/common';
import { CheckInService } from './check-in.service';
import { CheckInRepository } from './check-in.repository';
import { CheckInController } from './check-in.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EventModule } from '../event/event.module';
import { UsersModule } from '../users/users.module';
import { JobModule } from '../jobs/job.module';
import { CompanyModule } from '../company/company.module';
import { AddressModule } from '../address/address.module';
import { EditAttendanceById } from './use-cases/edit-attendance/edit-attendance-by-id.use-case';

@Module({
    imports: [PrismaModule, EventModule, UsersModule, JobModule, CompanyModule, AddressModule],
    providers: [CheckInService, CheckInRepository, EditAttendanceById],
    controllers: [CheckInController],
    exports: [CheckInService],
})
export class CheckInModule {}
