import { Injectable } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { PermissionConstants } from './permission.constants';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Result } from '../../shared/result/result.model';
import { AlreadyExistsError } from '../../shared/errors/already-exists.error';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { EntityNotFoundError } from '../../shared/errors/entity-not-found.error';
import { PermissionRepository } from './permission.repository';
import { CustomLogger } from '../log/custom.logger';

@Injectable()
export class PermissionService {
    private readonly logger = CustomLogger.getLogger(PermissionService.name);

    constructor(private permissionRepo: PermissionRepository) {}

    async getUserDefaultPermissions(): Promise<Permission[]> {
        return this.permissionRepo.getUserDefaultPermissions(PermissionConstants.names.userDefaultPermissions);
    }

    async create(createPermissionDto: CreatePermissionDto): Promise<Result> {
        this.logger.info('persisting new permission');
        const alreadyExists = await this.findByName(createPermissionDto.name);
        const message = `${PermissionConstants.errors.alreadyExistsError}: ${createPermissionDto.name}`;
        if (alreadyExists) {
            this.logger.error(message);
            return new Result(
                PermissionConstants.errors.alreadyExistsError.toString(),
                null,
                new AlreadyExistsError(PermissionConstants.errors.alreadyExistsError),
            );
        }
        try {
            const permission = await this.permissionRepo.create(createPermissionDto);
            this.logger.info(`permission successfully persisted, id: ${permission.id}`);
            return new Result(PermissionConstants.messages.creationSuccess.toString(), permission, null);
        } catch (error) {
            return new Result(error.message, null, error);
        }
    }

    async count(): Promise<number> {
        return await this.permissionRepo.count();
    }
    async findAll(skip: number, take: number): Promise<Permission[]> {
        this.logger.info(`listing permissions, offset: ${skip} - limit: ${take}`);
        const permissions = await this.permissionRepo.findAll(skip, take);
        this.logger.info(`permissions found: ${permissions.length}`);
        return permissions;
    }

    async findById(id: string) {
        this.logger.info(`searching database for permission id "${id}"`);
        const permission = await this.permissionRepo.findById(id);
        if (!permission) {
            this.logger.error(PermissionConstants.errors.notFoundError);
            return null;
        }
        this.logger.info(`permission "${permission.name}" found for id "${id}"`);
        return permission;
    }

    private async findByName(name: string): Promise<Permission> {
        this.logger.info(`searching database for permission name "${name}"`);
        const permission = await this.permissionRepo.findByName(name);
        if (!permission) {
            this.logger.error(PermissionConstants.errors.notFoundError);
            return null;
        }
        this.logger.info(`permission "${permission.id}" found for id "${name}"`);
        return permission;
    }

    async update(id: string, updatePermissionDto: UpdatePermissionDto): Promise<Result> {
        this.logger.info(`updating permission "${id}"`);
        const permissionById = await this.findById(id);
        const permissionByName = await this.findByName(updatePermissionDto.name);
        if (!permissionById) {
            this.logger.error(PermissionConstants.errors.updateError);
            return new Result(
                PermissionConstants.errors.updateError.toString(),
                null,
                new EntityNotFoundError(PermissionConstants.errors.notFoundError),
            );
        } else if (permissionByName && permissionByName.id !== id) {
            return new Result(
                PermissionConstants.errors.alreadyExistsError.toString(),
                null,
                new EntityNotFoundError(PermissionConstants.errors.alreadyExistsError),
            );
        }
        const updatedPermission = await this.permissionRepo.update(id, updatePermissionDto);
        this.logger.info(`permission "${updatedPermission.id}" successfully updated`);
        return new Result(PermissionConstants.messages.updateSuccess, updatedPermission, null);
    }

    async remove(id: string) {
        this.logger.info(`removing permission "${id}"`);
        const permission = await this.findById(id);
        if (!permission) {
            this.logger.error(PermissionConstants.errors.updateError);
            return new Result(
                PermissionConstants.errors.deleteError.toString(),
                null,
                new EntityNotFoundError(PermissionConstants.errors.deleteError),
            );
        }
        const removedPermission = await this.permissionRepo.delete(id);
        this.logger.info(PermissionConstants.messages.deleteSuccess);
        return new Result(PermissionConstants.messages.updateSuccess, removedPermission, null);
    }
}
