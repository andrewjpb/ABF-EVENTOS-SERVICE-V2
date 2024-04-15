import { Module } from '@nestjs/common';
import { SupporterService } from './supporter.service';
import { SupporterController } from './supporter.controller';
import { SupporterRepository } from './supporter.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [SupporterController],
    providers: [SupporterService, SupporterRepository],
    exports: [SupporterService],
})
export class SupporterModule {}
