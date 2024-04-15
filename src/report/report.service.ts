import { Injectable } from '@nestjs/common';
import { CustomLogger } from '../log/custom.logger';
import { UsersService } from '../users/users.service';
import { EventService } from '../event/event.service';
import { UsersReportDto } from '../../shared/dto/reports/user/users-report.dto';
import { EventTypeEnum } from '../event/enum/event-type.enum';

@Injectable()
export class ReportService {
    private readonly logger = CustomLogger.getLogger(ReportService.name);

    constructor(private readonly userService: UsersService, private readonly eventService: EventService) {}

    async getUsersReport(): Promise<UsersReportDto> {
        return await this.userService.generateUsersReport();
    }

    async getEventsReport(
        format?: EventTypeEnum,
        dateFilter?: {
            begin: string;
            end: string;
        },
        state?: string,
        city?: string,
    ) {
        return await this.eventService.getEventsReport(format, dateFilter, state, city);
    }
}
