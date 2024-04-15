import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Response } from 'express';
import { PermissionConstants } from './permission.constants';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AlreadyExistsError } from '../../shared/errors/already-exists.error';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { AuthGuard } from '../auth/auth.guard';
import { PageDto } from '../../shared/dto/page.dto';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiTags('Permissions')
@Controller('permission')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {}

    @Get()
    async findAll(
        @Query('offset') skip: number,
        @Query('size') take: number,
        @Res() response: Response,
    ): Promise<Response> {
        skip = skip ? skip : 0;
        take = take && take >= 100 ? take : 100;
        return response
            .status(HttpStatus.ACCEPTED)
            .json(new PageDto(await this.permissionService.count(), await this.permissionService.findAll(skip, take)));
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() response: Response) {
        const permission = await this.permissionService.findById(id);
        if (!permission) {
            return response.status(HttpStatus.NOT_FOUND).json({ message: PermissionConstants.errors.notFoundError });
        }
        return response.status(HttpStatus.ACCEPTED).json(permission);
    }

    @Post()
    async create(@Body() createPermissionDto: CreatePermissionDto, @Res() response: Response): Promise<Response> {
        const result = await this.permissionService.create(createPermissionDto);
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
        @Body() updatePermissionDto: UpdatePermissionDto,
        @Res() response: Response,
    ): Promise<Response> {
        const result = await this.permissionService.update(id, updatePermissionDto);
        if (result.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: result.error.message });
        }
        return response.status(200).json({
            message: PermissionConstants.messages.updateSuccess,
            user: result.data,
        });
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() response: Response) {
        const result = await this.permissionService.remove(id);
        if (result.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: result.error.message });
        }
        return response.status(HttpStatus.ACCEPTED).json({
            message: PermissionConstants.messages.deleteSuccess,
            deletedPermission: result.data,
        });
    }
}
