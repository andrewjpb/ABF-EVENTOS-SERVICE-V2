import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { ResetTokenRepository } from './reset-token.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { EncryptionModule } from '../util/encryption.module';
import { JobModule } from '../jobs/job.module';
import { JobService } from '../jobs/job.service';

@Module({
    imports: [
        PrismaModule,
        UsersModule,
        EmailModule,
        EncryptionModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '30d' },
        }),
        JobModule,
    ],
    providers: [AuthService, ResetTokenRepository, JobService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
