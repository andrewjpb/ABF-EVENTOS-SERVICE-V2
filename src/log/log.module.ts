import { Module } from '@nestjs/common';
import { CustomLogger } from './custom.logger';

@Module({
    providers: [CustomLogger],
})
export class LogModule {}
