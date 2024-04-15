import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { CustomLogger } from '../../src/log/custom.logger';

@Injectable()
export class RequestMetricsMiddleware implements NestMiddleware {
    private readonly yellow = '\x1b[33m';
    private readonly logger = CustomLogger.getLogger(
        RequestMetricsMiddleware.name,
    );

    use(req: Request, res: Response, next: NextFunction) {
        const start = new Date().getMilliseconds();
        const token = req.headers['authorization']?.split(' ')[0] ?? null;
        next();
        const duration = new Date().getMilliseconds() - start;
        this.logger.info(
            `method: "${req.method}", url: "${
                req.url
            }", auth-token-present: "${!!token}", duration: ${
                this.yellow
            }+${duration}ms`,
        );
    }
}
