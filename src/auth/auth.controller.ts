import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    Request,
    Res,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { ResetTokenDto } from './dto/reset-token.dto';
import { UsersService } from '../users/users.service';
import { ResetTokenRepository } from './reset-token.repository';
import { JobService } from '../jobs/job.service';
import { CustomLogger } from '../log/custom.logger';
import { Role } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    private readonly logger = CustomLogger.getLogger(AuthController.name);
    private readonly ADMIN_ROLE_NAME = 'admin';
    private readonly resetPasswordMessage = 'Um link de recuperação de senha será enviado para o seu e-mail';

    constructor(
        private authService: AuthService,
        private readonly userService: UsersService,
        private readonly resetPassRepo: ResetTokenRepository,
        private readonly jobService: JobService,
    ) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: LoginDto, @Res() response: Response): Promise<Response> {
        const result = await this.authService.signIn(signInDto.username, signInDto.password);
        if (result.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: result.message });
        }

        return response.status(HttpStatus.ACCEPTED).json(result.data);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Request() req: Request) {
        const userResult = await this.userService.findById(req['user']);
        const sanitizedUser = this.userService.sanitizeUser(userResult.data);
        const isAdmin = sanitizedUser.roles.filter((r: Role) => r.name === this.ADMIN_ROLE_NAME).length > 0;
        sanitizedUser.roles = this.authService.dehydrateRolesAndPermissions(sanitizedUser.roles);
        return { isAdmin, ...sanitizedUser };
    }

    @Post('/password/reset/:token')
    async redefinePassword(
        @Param('token') tokenId: string,
        @Body('newPassword') newPassword: string,
        @Res() response: Response,
    ): Promise<Response> {
        const resetToken = await this.resetPassRepo.findById(tokenId);

        if (!resetToken || resetToken.used || Date.now() > resetToken.ttl.getTime()) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                message: 'token inválido',
            });
        }
        const userResult = await this.userService.findById(resetToken.userId);
        if (userResult.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                message: 'não é possível atualizar a senha de um usuário já removido',
            });
        }
        const user = userResult.data;
        const userUpdateDto = new UpdateUserDto();
        userUpdateDto.name = user.name;
        userUpdateDto.username = user.username;
        userUpdateDto.email = user.email;
        userUpdateDto.rg = user.rg;
        userUpdateDto.cpf = user.cpf;
        userUpdateDto.cnpj = user.company;
        userUpdateDto.position = user.position;
        userUpdateDto.city = user.city;
        userUpdateDto.state = user.state;
        userUpdateDto.password = newPassword;
        await this.userService.update(user.id, userUpdateDto);
        await this.resetPassRepo.markAsUsed(resetToken.id);
        return response.status(HttpStatus.ACCEPTED).json({
            message: 'senha atualizada com sucesso',
        });
    }

    @Get('password/reset')
    async resetPassword(@Query('email') email: string, @Res() response: Response): Promise<Response> {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            // TODO - enviar resposta genérica por segurança?
            return response.status(HttpStatus.BAD_REQUEST).json({ message: 'usuário não encontrado' });
        }
        const resetTokenDto = new ResetTokenDto(user.id, new Date(Date.now() + 15 * 60 * 1000), false);
        const resetToken = await this.resetPassRepo.create(resetTokenDto);
        // TODO - montar o link que vai no email
        await this.jobService.pushResetPassEmailJob(user.name, user.email, resetToken.id);
        this.logger.info(`token: ${resetToken.id}`);
        return response.status(HttpStatus.ACCEPTED).json({ message: this.resetPasswordMessage });
    }
}
