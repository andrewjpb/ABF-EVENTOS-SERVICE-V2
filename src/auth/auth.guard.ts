import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request, Response } from 'express';
import { CustomLogger } from '../log/custom.logger';

@Injectable()
export class AuthGuard implements CanActivate {
    protected readonly logger = CustomLogger.getLogger(AuthGuard.name);

    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            this.logger.error('no authorization token present');
            return this.unauthorized(response);
        }
        try {
            const claims = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret,
            });
            request['user'] = claims.user;
        } catch {
            this.logger.error('invalid authorization token');
            return this.unauthorized(response);
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    private unauthorized(response: Response) {
        response.status(HttpStatus.UNAUTHORIZED).json({
            message: 'não autenticado',
        });
        return false;
    }
}
