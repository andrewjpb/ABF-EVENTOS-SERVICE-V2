import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class FindUserByNameService {
    constructor(private readonly usersRepo: UsersRepository) {}

    async handle(name: string): Promise<any> {
        return await this.usersRepo.findByName(name);
    }
}
