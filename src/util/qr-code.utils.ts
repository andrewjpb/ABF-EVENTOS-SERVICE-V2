import * as QRCode from 'qrcode';
import { CustomLogger } from '../log/custom.logger';
import { stringify } from 'ts-jest';

export class QrCodeUtils {
    private static readonly logger = CustomLogger.getLogger(QrCodeUtils.name);

    static async generateQrCode(value: any): Promise<string> {
        try {
            value = stringify(value);
            this.logger.info('generating qr-code');
            const qrCode = await QRCode.toDataURL(value);
            this.logger.info('qr-code successfully generated');
            return qrCode;
        } catch (error) {
            this.logger.error(`error generating qr-code: ${error.message}`);
            return null;
        }
    }
}
