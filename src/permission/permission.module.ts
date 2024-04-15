import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PermissionRepository } from './permission.repository';

@Module({
    imports: [PrismaModule],
    controllers: [PermissionController],
    providers: [PermissionService, PermissionRepository],
    exports: [PermissionService],
})
export class PermissionModule {}
