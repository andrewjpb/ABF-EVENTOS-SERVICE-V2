import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { InternalError } from '../../shared/errors/internal.error';
import { CustomLogger } from '../log/custom.logger';

@Injectable()
export class EncryptionService {
    private readonly logger = CustomLogger.getLogger(EncryptionService.name);

    public async encryptString(plainText: string): Promise<string> {
        try {
            const salt = await bcrypt.genSalt();
            return await bcrypt.hash(plainText, salt);
        } catch (error) {
            const message = 'error encrypting text';
            this.logger.error(message);
            throw new InternalError(message);
        }
    }

    public async compareToHash(text: string, hash: string): Promise<boolean> {
        return bcrypt.compare(text, hash);
    }
}
