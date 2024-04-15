import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { CustomLogger } from '../log/custom.logger';
import { UserReportRowDto } from '../../shared/dto/reports/user/user-report-row.dto';
import { PaginationParamsUserDto } from './dto/query-list-user.dto';

@Injectable()
export class UsersRepository {
    private readonly logger = CustomLogger.getLogger(UsersRepository.name);

    constructor(private prisma: PrismaService) {}

    async create(createUserDto: CreateUserDto, roleId: string): Promise<User> {
        return this.prisma.user.create({
            data: {
                name: createUserDto.name,
                username: createUserDto.username,
                email: createUserDto.email,
                password: createUserDto.password,
                rg: createUserDto.rg,
                cpf: createUserDto.cpf,
                cnpj: createUserDto.cnpj,
                position: createUserDto.position,
                city: createUserDto.city,
                state: createUserDto.state,
                image_url: createUserDto.image_url,
                thumb_url: createUserDto.thumb_url,
                mobile_phone: createUserDto.mobile_phone,
                roles: {
                    connect: { id: roleId },
                },
            },
        });
    }

    async findByUsername(username: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: {
                username,
            },
            include: {
                roles: {
                    include: {
                        permissions: true,
                    },
                },
            },
        });

        if (!user) {
            this.logger.info(`user "${username}" not found`);
            return null;
        }

        return user;
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
            include: {
                roles: {
                    include: {
                        permissions: true,
                    },
                },
            },
        });

        if (!user) {
            this.logger.error(`user with email "${email}" not found`);
            return null;
        }

        return user;
    }

    async findById(id: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
            include: {
                roles: {
                    include: {
                        permissions: true,
                    },
                },
            },
        });

        if (!user) {
            this.logger.error(`user "${id}" not found`);
            return null;
        }

        return user;
    }

    async findAllPaginated(params: PaginationParamsUserDto): Promise<User[]> {
        const { offset = 0, size = 10, contains } = params;

        const whereCondition = contains
            ? {
                  OR: [
                      { name: { contains } },
                      { username: { contains } },
                      { email: { contains } },
                      { cnpj: { contains } },
                      { cpf: { contains } },
                      { mobile_phone: { contains } },
                      // Inclua aqui a condição para 'cnpj' da empresa, se aplicável
                  ],
              }
            : {};

        const users = await this.prisma.user.findMany({
            skip: offset,
            take: size,
            where: whereCondition,
            include: {
                roles: {
                    include: {
                        permissions: true,
                    },
                },
            },
        });

        return users;
    }

    async rgInUse(rg: string): Promise<boolean> {
        return !!(await this.prisma.user.findUnique({ where: { rg } }));
    }

    async cpfInUse(cpf: string): Promise<boolean> {
        return !!(await this.prisma.user.findUnique({ where: { cpf } }));
    }
    async mobilePhoneUse(mobile_phone: string): Promise<boolean> {
        return !!(await this.prisma.user.findUnique({ where: { mobile_phone } }));
    }

    async count(): Promise<number> {
        return this.prisma.user.count();
    }

    async findAll(skip: number, take: number): Promise<User[]> {
        const users = await this.prisma.user.findMany({
            skip,
            take,
            include: {
                roles: {
                    include: {
                        permissions: true,
                    },
                },
            },
        });
        return users.map((user) => {
            return user;
        });
    }

    async delete(id: string): Promise<{ username: string; email: string }> {
        const user = await this.prisma.user.delete({
            where: { id },
            include: {
                roles: {
                    include: {
                        permissions: true,
                    },
                },
            },
        });

        return {
            username: user.username,
            email: user.email,
        };
    }

    async update(id: string, updateUserDTO: UpdateUserDto): Promise<any> {
        return this.prisma.user.update({
            where: { id },
            data: updateUserDTO,
        });
    }

    async updateStatus(id: string, status: boolean): Promise<any> {
        return this.prisma.user.update({
            where: { id },
            data: {
                active: status,
            },
        });
    }

    async getUserCountByStatus(active: boolean): Promise<number> {
        return this.prisma.user.count({
            where: { active },
        });
    }

    async getUsersReportRows(): Promise<UserReportRowDto[]> {
        const users = await this.prisma.user.findMany({
            orderBy: {
                username: 'asc',
            },
        });

        return users.map((user: User) => {
            return {
                name: user.name,
                email: user.email,
                rg: user.rg,
                cpf: user.cpf,
                company: user.cnpj,
                position: user.position,
                active: user.active,
            };
        });
    }

    async setRole(userId: string, roleId: string): Promise<void> {
        try {
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    roles: {
                        connect: { id: roleId },
                    },
                },
            });
            this.logger.info(`Role "${roleId}" has been set for user "${userId}"`);
        } catch (error) {
            this.logger.error(`Failed to set role "${roleId}" for user "${userId}". Error: ${error.message}`);
            throw error;
        }
    }

    async removeRole(userId: string, roleId: string): Promise<void> {
        try {
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    roles: {
                        disconnect: { id: roleId },
                    },
                },
            });
            this.logger.info(`Role "${roleId}" has been removed from user "${userId}"`);
        } catch (error) {
            this.logger.error(`Failed to remove role "${roleId}" from user "${userId}". Error: ${error.message}`);
            throw error;
        }
    }
}
