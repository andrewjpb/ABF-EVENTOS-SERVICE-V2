import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersRepository } from './users.repository';
import { RoleModule } from '../role/role.module';
import { EncryptionModule } from '../util/encryption.module';
import { EmailModule } from '../email/email.module';
import { PermissionModule } from '../permission/permission.module';
import { EventModule } from '../event/event.module';
import { JobModule } from '../jobs/job.module';
import { JobService } from '../jobs/job.service';
import { CompanyModule } from '../company/company.module';
import { FindUserByNameController } from './v2/use-cases/FindUserByName/controller';
import { FindUserByNameService } from './v2/use-cases/FindUserByName/service';

@Module({
    imports: [
        PrismaModule,
        RoleModule,
        PermissionModule,
        EncryptionModule,
        EmailModule,
        EventModule,
        CompanyModule,
        JobModule,
    ],
    controllers: [UsersController, FindUserByNameController],
    providers: [UsersService, UsersRepository, JobService, FindUserByNameService],
    exports: [UsersService],
})
export class UsersModule {}
