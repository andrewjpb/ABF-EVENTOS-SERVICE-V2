import { UserReportRowDto } from './user-report-row.dto';
import { UsersReportHeaderDto } from './users-report-header.dto';

export class UsersReportDto {
    constructor(
        public readonly header: UsersReportHeaderDto,
        public readonly rows: UserReportRowDto[],
    ) {}
}
