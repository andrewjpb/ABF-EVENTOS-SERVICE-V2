import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Permission } from '@prisma/client';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionConstants } from './permission.constants';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { CustomLogger } from '../log/custom.logger';

@Injectable()
export class PermissionRepository {
    private readonly logger = CustomLogger.getLogger(PermissionRepository.name);

    constructor(private readonly prisma: PrismaService) {}

    async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
        return this.prisma.permission.create({
            data: {
                name: createPermissionDto.name,
                description: createPermissionDto.description,
            },
        });
    }

    async getUserDefaultPermissions(names: string[]) {
        return this.prisma.permission.findMany({
            where: {
                name: { in: names },
            },
        });
    }

    async findByName(name: string): Promise<Permission> {
        const permission = await this.prisma.permission.findUnique({
            where: {
                name,
            },
        });

        if (!permission) {
            this.logger.error(PermissionConstants.errors.notFoundError);
            return null;
        }

        return permission;
    }

    async findById(id: string): Promise<Permission> {
        const permission = await this.prisma.permission.findUnique({
            where: {
                id,
            },
        });

        if (!permission) {
            this.logger.error(PermissionConstants.errors.notFoundError);
            return null;
        }

        return permission;
    }

    count(): Promise<number> {
        return this.prisma.permission.count();
    }

    async findAll(skip: number, take: number): Promise<Permission[]> {
        return this.prisma.permission.findMany({
            skip,
            take,
        });
    }

    async delete(id: string): Promise<Permission> {
        return this.prisma.permission.delete({
            where: { id },
        });
    }

    async update(id: string, updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
        return this.prisma.permission.update({
            where: { id },
            data: {
                name: updatePermissionDto.name,
                description: updatePermissionDto.description,
            },
        });
    }
}
