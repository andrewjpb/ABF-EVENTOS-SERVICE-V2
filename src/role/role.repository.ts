import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleConstants } from './role.constants';
import { Role } from '@prisma/client';
import { CustomLogger } from '../log/custom.logger';

@Injectable()
export class RoleRepository {
    private readonly logger = CustomLogger.getLogger(RoleRepository.name);

    constructor(private prisma: PrismaService) {}

    async create(createRoleDto: CreateRoleDto): Promise<any> {
        return this.prisma.role.create({
            data: {
                name: createRoleDto.name,
                description: createRoleDto.description,
                permissions: {
                    connect: createRoleDto.permissions.map((p: string) => {
                        return { id: p };
                    }),
                },
            },
        });
    }

    async findByName(name: string): Promise<Role> {
        const role = await this.prisma.role.findUnique({
            where: {
                name,
            },
            include: {
                permissions: true,
            },
        });

        if (!role) {
            this.logger.error(RoleConstants.errors.notFoundError);
            return null;
        }

        return role;
    }

    async findById(id: string): Promise<any> {
        const role = await this.prisma.role.findUnique({
            where: {
                id,
            },
            include: {
                permissions: true,
            },
        });

        if (!role) {
            this.logger.error(RoleConstants.errors.notFoundError);
            return null;
        }

        return role;
    }

    async count(): Promise<number> {
        return this.prisma.role.count();
    }

    async findAll(skip: number, take: number): Promise<any> {
        return this.prisma.role.findMany({
            skip,
            take,
            include: {
                permissions: true,
            },
        });
    }

    async delete(id: string): Promise<any> {
        return this.prisma.role.delete({
            where: { id },
        });
    }

    async update(id: string, updateRoleDTO: UpdateRoleDto) {
        return this.prisma.role.update({
            where: { id },
            data: {
                name: updateRoleDTO.name,
                description: updateRoleDTO.description,
                permissions: {
                    connect: updateRoleDTO.permissions.map((p: string) => {
                        return { id: p };
                    }),
                },
            },
        });
    }
}
