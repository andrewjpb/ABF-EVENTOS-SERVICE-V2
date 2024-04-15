import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
    Res,
    UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleConstants } from './role.constants';
import { Response } from 'express';
import { AlreadyExistsError } from '../../shared/errors/already-exists.error';
import { AuthGuard } from '../auth/auth.guard';
import { PageDto } from '../../shared/dto/page.dto';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';

@UseGuards(AuthGuard)
@ApiTags('Roles')
@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService, private readonly userService: UsersService) {}

    @Get()
    async findAll(@Res() response: Response, @Query('offset') skip: number, @Query('size') take: number) {
        skip = skip ? skip : 0;
        take = take && take >= 100 ? take : 100;
        return response
            .status(HttpStatus.ACCEPTED)
            .json(new PageDto(await this.roleService.count(), await this.roleService.findAll(skip, take)));
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() response: Response) {
        const role = await this.roleService.findById(id);
        if (!role) {
            return response.status(HttpStatus.NOT_FOUND).json({ message: RoleConstants.errors.notFoundError });
        }
        return response.status(HttpStatus.ACCEPTED).json(role);
    }

    @Post()
    async create(@Body() createRoleDto: CreateRoleDto, @Res() response: Response): Promise<Response> {
        const result = await this.roleService.create(createRoleDto);
        if (result.error) {
            const status =
                result.error instanceof AlreadyExistsError ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR;
            return response.status(status).json({ message: result.error.message });
        }
        return response.status(HttpStatus.CREATED).json(result.data);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateRoleDto: UpdateRoleDto,
        @Res() response: Response,
    ): Promise<Response> {
        const result = await this.roleService.update(id, updateRoleDto);
        if (result.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: result.error.message });
        }
        return response.status(200).json({
            message: RoleConstants.messages.updateSuccess,
            user: result.data,
        });
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() response: Response) {
        const result = await this.roleService.remove(id);
        if (result.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: result.error.message });
        }
        return response.status(HttpStatus.ACCEPTED).json({
            message: RoleConstants.messages.deleteSuccess,
            deletedRole: result.data,
        });
    }

    @Post('toggle-admin/:userId')
    async toggleAdminRole(@Param('userId') userId: string, @Body('status') status: boolean, @Res() response: Response) {
        try {
            const user = await this.userService.toggleAdminRole(userId, status); // atualiza o nome do método também
            const message = status
                ? 'Permissão de administrador concedida com sucesso ao usuário.'
                : 'Permissão de administrador removida com sucesso do usuário.';

            return response.status(HttpStatus.OK).json({
                message,
                user,
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                return response.status(HttpStatus.NOT_FOUND).json({ message: error.message });
            }
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Ocorreu um erro' });
        }
    }
}
