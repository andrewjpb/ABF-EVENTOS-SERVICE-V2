import { Injectable } from '@nestjs/common';
import winston, { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { StringUtils } from '../util/string.utils';

@Injectable()
export class CustomLogger {
    public static getLogger(className: string): winston.Logger {
        const logFormat = format.printf((template) => {
            const red = '\x1b[31m';
            const green = '\x1b[32m';
            const yellow = '\x1b[33m';
            const cyan = '\x1b[36m';
            const white = '\x1b[37m';

            let logLevelColor: string;

            switch (template.level) {
                case 'debug':
                    logLevelColor = cyan;
                    break;
                case 'info':
                    logLevelColor = green;
                    break;
                case 'warn':
                    logLevelColor = yellow;
                    break;
                case 'error':
                    logLevelColor = red;
                    break;
                default:
                    logLevelColor = white;
            }

            return `${green}[CustomLogger] - ${white}${this.formatDate(template.timestamp)} ${green}- ${yellow}[${
                template.label
            }] ${logLevelColor}${template.level.toUpperCase()}: ${green}${template.message}`;
        });

        const file = new transports.DailyRotateFile({
            filename: './logs/%DATE%.log',
            datePattern: 'DD-MM-YYYY',
            maxFiles: '30d',
            json: false,
            format: format.printf((template) => {
                return `[CustomLogger] - ${this.formatDate(template.timestamp)} - [${
                    template.label
                }] ${template.level.toUpperCase()}: ${template.message}`;
            }),
        });

        const console = new transports.Console({
            format: format.combine(format.label({ label: className }), format.timestamp(), logFormat),
        });

        return createLogger({
            level: 'info',
            format: format.combine(format.label({ label: className }), format.timestamp()),
            transports: [file, console],
        });
    }

    private static formatDate(timestamp: string): string {
        const date = new Date(timestamp);

        const day = StringUtils.padLeft(date.getDate());
        const month = StringUtils.padLeft(date.getMonth() + 1);
        const year = date.getFullYear();

        const hour = StringUtils.padLeft(date.getHours());
        const minute = StringUtils.padLeft(date.getMinutes());
        const second = StringUtils.padLeft(date.getSeconds());

        return `${day}/${month}/${year}, ${hour}:${minute}:${second}`;
    }
}
