import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleRepository } from './role.repository';
import { Role } from '@prisma/client';
import { AlreadyExistsError } from '../../shared/errors/already-exists.error';
import { RoleConstants } from './role.constants';
import { Result } from '../../shared/result/result.model';
import { EntityNotFoundError } from '../../shared/errors/entity-not-found.error';
import { CustomLogger } from '../log/custom.logger';

@Injectable()
export class RoleService {
    private readonly logger = CustomLogger.getLogger(RoleService.name);

    constructor(private roleRepo: RoleRepository) {}

    public async getDefaultRole(): Promise<Role> {
        this.logger.info('getting default user role');
        return await this.findByName(RoleConstants.names.userDefaultRole);
    }

    async create(createRoleDto: CreateRoleDto): Promise<Result> {
        this.logger.info('persisting new role');
        const alreadyExists = await this.findByName(createRoleDto.name);
        const message = `${RoleConstants.errors.alreadyExistsError}: ${createRoleDto.name}`;
        if (alreadyExists) {
            this.logger.error(message);
            return new Result(
                RoleConstants.errors.alreadyExistsError.toString(),
                null,
                new AlreadyExistsError(RoleConstants.errors.alreadyExistsError),
            );
        }
        try {
            const role = await this.roleRepo.create(createRoleDto);
            this.logger.info(`role successfully persisted, id: ${role.id}`);
            return new Result(RoleConstants.messages.creationSuccess.toString(), role, null);
        } catch (error) {
            return new Result(error.message, null, error);
        }
    }

    async count(): Promise<number> {
        return await this.roleRepo.count();
    }

    async findAll(skip: number, take: number) {
        this.logger.info(`listing roles, offset: ${skip} - limit: ${take}`);
        const roles = await this.roleRepo.findAll(skip, take);
        this.logger.info(`roles found: ${roles.length}`);
        return roles;
    }

    async findById(id: string) {
        this.logger.info(`searching database for role id "${id}"`);
        const role = await this.roleRepo.findById(id);
        if (!role) {
            this.logger.error(RoleConstants.errors.notFoundError);
            return null;
        }
        this.logger.info(`role "${role.name}" found for id "${id}"`);
        return role;
    }

    async findByName(name: string): Promise<Role> {
        this.logger.info(`searching database for role name "${name}"`);
        const role = await this.roleRepo.findByName(name);
        if (!role) {
            this.logger.error(RoleConstants.errors.notFoundError);
            return null;
        }
        this.logger.info(`role "${role.id}" found for id "${name}"`);
        return role;
    }

    async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Result> {
        this.logger.info(`updating role "${id}"`);
        const roleById = await this.findById(id);
        const roleByName = await this.findByName(updateRoleDto.name);
        if (!roleById) {
            this.logger.error(RoleConstants.errors.updateError);
            return new Result(
                RoleConstants.errors.updateError.toString(),
                null,
                new EntityNotFoundError(RoleConstants.errors.notFoundError),
            );
        } else if (roleByName && roleByName.id !== id) {
            return new Result(
                RoleConstants.errors.alreadyExistsError.toString(),
                null,
                new EntityNotFoundError(RoleConstants.errors.alreadyExistsError),
            );
        }
        const updatedRole = await this.roleRepo.update(id, updateRoleDto);
        this.logger.info(`role "${updatedRole.id}" successfully updated`);
        return new Result(RoleConstants.messages.updateSuccess, updatedRole, null);
    }

    async remove(id: string) {
        this.logger.info(`removing role "${id}"`);
        const role = await this.findById(id);
        if (!role) {
            this.logger.info(RoleConstants.errors.updateError);
            return new Result(
                RoleConstants.errors.deleteError.toString(),
                null,
                new EntityNotFoundError(RoleConstants.errors.deleteError),
            );
        }
        const removedRole = await this.roleRepo.delete(id);
        this.logger.info(RoleConstants.messages.deleteSuccess);
        return new Result(RoleConstants.messages.updateSuccess, removedRole, null);
    }
}
