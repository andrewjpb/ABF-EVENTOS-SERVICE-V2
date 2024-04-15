import { Module, forwardRef } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RoleRepository } from './role.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [PrismaModule, forwardRef(() => UsersModule)],
    controllers: [RoleController],
    providers: [RoleService, RoleRepository],
    exports: [RoleService],
})
export class RoleModule {}
