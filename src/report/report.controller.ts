import { Controller, Get, HttpStatus, Query, Res, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { CustomLogger } from '../log/custom.logger';
import { EventTypeEnum } from '../event/enum/event-type.enum';
import { stringify } from 'ts-jest';
import { AuthGuard } from '../auth/auth.guard';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiTags('Reports')
@Controller('/report')
export class ReportController {
    private readonly logger = CustomLogger.getLogger(ReportController.name);

    constructor(private readonly reportService: ReportService) {}

    @Get('/users')
    async getUserReport(@Res() response: Response): Promise<Response> {
        this.logger.info('generating users report');
        const report = await this.reportService.getUsersReport();
        this.logger.info(`report successfully generated, users total: ${report.rows.length}`);
        return response.status(HttpStatus.ACCEPTED).json(report);
    }

    @Get('/events')
    async getEventsReport(
        @Res() response: Response,
        @Query('format') format?: EventTypeEnum,
        @Query('date-begin') begin?: string,
        @Query('date-end') end?: string,
        @Query('state') state?: string,
        @Query('city') city?: string,
    ): Promise<Response> {
        this.logger.info('generating events report');
        let dateFilter = null;
        if (begin && end) {
            dateFilter = {
                begin,
                end,
            };
            this.logger.info(`filtering events by date range: "${stringify(dateFilter)}"`);
        }
        const report = await this.reportService.getEventsReport(format, dateFilter, city, state);
        this.logger.info(`report successfully generated, users total: ${report.rows.length}`);
        return response.status(HttpStatus.ACCEPTED).json(report);
    }
}
