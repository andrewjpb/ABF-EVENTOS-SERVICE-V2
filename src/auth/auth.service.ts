import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedRrror } from 'shared/errors/unauthorized.rrror';
import { Role } from '@prisma/client';
import { EncryptionService } from '../util/encryption.service';
import { Result } from '../../shared/result/result.model';

type payloadProps = {
    user: string;
    roles: Array<string>;
    permissions: Array<string>;
    sub: string;
};

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly encryptionService: EncryptionService,
    ) {}

    async signIn(username: string, pass: string): Promise<Result> {
        let user = await this.usersService.findByUsername(username);
        if (!user) {
            const message = 'credenciais inválidas';
            return new Result(message, null, new UnauthorizedRrror(message));
        }
        if (user.active) {
            const isPasswordMatching = await this.encryptionService.compareToHash(pass, user.password);
            if (!isPasswordMatching) {
                throw new UnauthorizedRrror('Senha incorreta');
            }
        }
        user = this.usersService.sanitizeUser(user);
        const payload: payloadProps = {
            user: user.id,
            permissions: user.roles.flatMap((r) => {
                return r.permissions.map((p) => {
                    return p.name;
                });
            }),
            roles: user.roles.map((r: Role) => r.name),
            sub: user.id,
        };
        return new Result(
            'login bem sucedido',
            {
                token: await this.generateJWT(payload),
                user: this.dehydrateUser(user),
            },
            null,
        );
    }

    dehydrateUser(user) {
        return {
            id: user.id,
            name: user.name,
            roles: this.dehydrateRolesAndPermissions(user.roles),
        };
    }

    dehydrateRolesAndPermissions(roles) {
        roles = roles.map((r) => {
            return {
                id: r.id,
                name: r.name,
                permissions: r.permissions.map((p) => {
                    return { id: p.id, name: p.name };
                }),
            };
        });
        return roles;
    }

    async generateJWT(payload: payloadProps) {
        return this.jwtService.sign(payload);
    }
}
