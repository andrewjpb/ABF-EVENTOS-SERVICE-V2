import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { RoleService } from '../role/role.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { EncryptionService } from '../util/encryption.service';
import { Result } from '../../shared/result/result.model';
import { AlreadyExistsError } from '../../shared/errors/already-exists.error';
import { UserConstants } from './user.constants';
import { EntityNotFoundError } from '../../shared/errors/entity-not-found.error';
import { User } from '@prisma/client';
import { CustomLogger } from '../log/custom.logger';
import { UsersReportDto } from '../../shared/dto/reports/user/users-report.dto';
import { UsersReportHeaderDto } from '../../shared/dto/reports/user/users-report-header.dto';
import { PaginationParamsUserDto } from './dto/query-list-user.dto';

@Injectable()
export class UsersService {
    private readonly logger = CustomLogger.getLogger(UsersService.name);

    constructor(
        private userRepo: UsersRepository,
        private roleService: RoleService,
        private encryptionService: EncryptionService,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<Result> {
        this.logger.info('persisting new user');
        const userByUsername = await this.findByUsername(createUserDto.username);
        const userByEmail = await this.userRepo.findByEmail(createUserDto.email);
        if (userByUsername) {
            const message = `${UserConstants.errors.usernameAlreadyInUse}: ${createUserDto.username}`;
            this.logger.error(message);
            return new Result(
                UserConstants.errors.usernameAlreadyInUse.toString(),
                null,
                new AlreadyExistsError(message),
            );
        } else if (userByEmail) {
            const message = `${UserConstants.errors.emailAlreadyInUse}: ${createUserDto.email}`;
            this.logger.error(message);
            return new Result(
                UserConstants.errors.emailAlreadyInUse.toString(),
                null,
                new EntityNotFoundError(message),
            );
        }
        const rgInUse = await this.userRepo.rgInUse(createUserDto.rg);
        const cpfInUse = await this.userRepo.cpfInUse(createUserDto.cpf);
        const mobilePhoneUse = await this.userRepo.mobilePhoneUse(createUserDto.mobile_phone);

        if (mobilePhoneUse) {
            const message = `${createUserDto.mobile_phone} telefone já cadastrado por outro usuário`;
            this.logger.error(message);
            throw new EntityNotFoundError(message);
        }
        if (cpfInUse) {
            const message = `${createUserDto.cpf} cpf já cadastrado por outro usuário`;
            this.logger.error(message);
            throw new EntityNotFoundError(message);
        }
        if (rgInUse) {
            const message = `${createUserDto.rg} rg já cadastrado por outro usuário`;
            this.logger.error(message);
            throw new EntityNotFoundError(message);
        }

        try {
            createUserDto.password = await this.encryptionService.encryptString(createUserDto.password);
            const defaultRole = await this.roleService.getDefaultRole();

            const user = await this.userRepo.create(createUserDto, defaultRole.id);
            this.logger.info(`user successfully persisted, id: ${user.id}`);
            return new Result(UserConstants.messages.creationSuccess.toString(), user, null);
        } catch (error) {
            return new Result(error.message, null, error);
        }
    }

    async count(): Promise<number> {
        return await this.userRepo.count();
    }

    async findAll(skip: number, take: number): Promise<User[]> {
        this.logger.info(`listing users, offset: ${skip} - limit: ${take}`);
        const users = await this.userRepo.findAll(skip, take);
        this.logger.info(`users found: ${users.length}`);
        return users;
    }

    async findAllPaginated(params: PaginationParamsUserDto): Promise<User[]> {
        this.logger.info(`listing users, offset: ${params.offset} - limit: ${params.size}`);
        const users = await this.userRepo.findAllPaginated(params);
        this.logger.info(`users found: ${users.length}`);
        return users;
    }

    async findById(id: string): Promise<Result> {
        this.logger.info(`searching database for user id "${id}"`);
        const user = await this.userRepo.findById(id);
        if (!user) {
            this.logger.error(UserConstants.errors.notFoundError);
            return new Result(
                UserConstants.errors.notFoundError,
                null,
                new EntityNotFoundError(UserConstants.errors.notFoundError),
            );
        }
        const message = `user "${user.username}" found for id "${id}"`;
        this.logger.info(message);
        return new Result(message, user, null);
    }

    async findByUsername(username: string): Promise<any> {
        this.logger.info(`searching database for username "${username}"`);
        const user = await this.userRepo.findByUsername(username);
        if (!user) {
            this.logger.error(UserConstants.errors.notFoundError);
            return null;
        }
        this.logger.info(`user "${user.id}" found for username "${username}"`);
        return user;
    }

    async findByEmail(email: string): Promise<any> {
        this.logger.info(`searching database for email "${email}"`);
        const user = await this.userRepo.findByEmail(email);
        if (!user) {
            this.logger.error(UserConstants.errors.notFoundError);
            return null;
        }
        this.logger.info(`user "${user.id}" found for username "${email}"`);
        return user;
    }

    async updateImageUrl(userId: string, imagePath: string, imageUrl?: string, thumbUrl?: string) {
        const user = await this.userRepo.findById(userId);
        user.image_url = imageUrl ? imageUrl : user.image_url;
        user.image_path = imageUrl ? imagePath : user.image_path;
        user.thumb_url = thumbUrl ? thumbUrl : user.thumb_url;
        user.thumb_path = thumbUrl ? imagePath : user.thumb_path;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { image_url, thumb_url, image_path, thumb_path } = user;
        await this.userRepo.update(userId, { image_url, thumb_url, image_path, thumb_path });
        this.logger.info(`user images successfully updated on database`);
    }

    async update(id: string, userUpdateDTO: UpdateUserDto) {
        this.logger.info(`updating user "${id}"`);
        const userByIdResult = await this.findById(id);
        const userByUsername = userUpdateDTO.username ? await this.findByUsername(userUpdateDTO.username) : null;
        const userByEmail = userUpdateDTO.email ? await this.userRepo.findByEmail(userUpdateDTO.email) : null;
        if (userByIdResult.error) {
            this.logger.error(UserConstants.errors.updateError);
            return new Result(
                UserConstants.errors.updateError.toString(),
                null,
                new EntityNotFoundError(UserConstants.errors.notFoundError),
            );
        } else if (userByEmail && userByEmail.id !== id) {
            this.logger.error(UserConstants.errors.emailAlreadyInUse);
            return new Result(
                UserConstants.errors.emailAlreadyInUse.toString(),
                null,
                new EntityNotFoundError(UserConstants.errors.emailAlreadyInUse),
            );
        } else if (userByUsername && userByUsername.id !== id) {
            return new Result(
                UserConstants.errors.usernameAlreadyInUse.toString(),
                null,
                new EntityNotFoundError(UserConstants.errors.usernameAlreadyInUse),
            );
        }
        if (userUpdateDTO.password) {
            userUpdateDTO.password = await this.encryptionService.encryptString(userUpdateDTO.password);
        }
        const updatedUser = await this.userRepo.update(id, userUpdateDTO);
        this.logger.info(`user "${updatedUser.id}" successfully updated`);
        return new Result(UserConstants.messages.updateSuccess, updatedUser, null);
    }

    async remove(id: string): Promise<any> {
        this.logger.info(`removing user "${id}"`);
        const userResult = await this.findById(id);
        if (userResult.error) {
            this.logger.error(UserConstants.errors.notFoundError);
            return new Result(
                UserConstants.errors.notFoundError.toString(),
                null,
                new EntityNotFoundError(UserConstants.errors.notFoundError),
            );
        }
        const removedUser = await this.userRepo.delete(id);
        this.logger.info(UserConstants.messages.deleteSuccess);
        return new Result(UserConstants.messages.deleteSuccess, removedUser, null);
    }

    async updateStatus(id: string, status: boolean) {
        return await this.userRepo.updateStatus(id, status);
    }

    async generateUsersReport(): Promise<UsersReportDto> {
        const rows = await this.userRepo.getUsersReportRows();
        const total = rows.length;
        const active = await this.userRepo.getUserCountByStatus(true);
        const inactive = await this.userRepo.getUserCountByStatus(false);
        const header = new UsersReportHeaderDto(total, active, inactive);
        return new UsersReportDto(header, rows);
    }

    async toggleAdminRole(userId: string, status: boolean): Promise<Result> {
        this.logger.info(`setting admin role for user "${userId}" based on status ${status}`);

        // 1. Encontrar o usuário pelo ID.
        const user = await this.userRepo.findById(userId);
        if (!user) {
            this.logger.error(UserConstants.errors.notFoundError);
            return new Result(
                UserConstants.errors.notFoundError.toString(),
                null,
                new EntityNotFoundError(UserConstants.errors.notFoundError),
            );
        }

        // 2. Encontrar a role de admin.
        const adminRole = await this.roleService.findByName('admin');
        if (!adminRole) {
            this.logger.error('Admin role not found');
            return new Result('Admin role not found', null, new EntityNotFoundError('Admin role not found'));
        }

        if (status) {
            // 3. Se status for verdadeiro, adicionar a role de admin ao usuário.
            await this.userRepo.setRole(userId, adminRole.id);
            this.logger.info(`admin role added to user "${userId}" successfully`);
            return new Result('Admin role added successfully', user, null);
        } else {
            // 4. Se status for falso, remover a role de admin do usuário.
            await this.userRepo.removeRole(userId, adminRole.id); // Você precisará criar esta função.
            this.logger.info(`admin role removed from user "${userId}" successfully`);
            return new Result('Admin role removed successfully', user, null);
        }
    }

    public sanitizeUser(user: User): any {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...sanitizedUser } = user;
        return sanitizedUser;
    }
}
