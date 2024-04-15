import { CustomLogger } from '../log/custom.logger';
import { stringify } from 'ts-jest';
import { StringUtils } from './string.utils';

export class DateUtil {
    private static readonly logger = CustomLogger.getLogger(Date.name);

    public static getTodayWithoutTime(): Date {
        const today = new Date();
        const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        this.logger.info(`today is: ${stringify(todayWithoutTime)}`);

        return todayWithoutTime;
    }

    public static format(date: Date): string {
        return `${StringUtils.padLeft(date.getDate())}/${StringUtils.padLeft(date.getMonth())}/${date.getFullYear()}`;
    }
}
