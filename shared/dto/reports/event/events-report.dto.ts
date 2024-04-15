import { EventsReportHeaderDto } from './events-report-header.dto';
import { EventsReportRowDto } from './events-report-row.dto';

export class EventsReportDto {
    constructor(
        public readonly header: EventsReportHeaderDto,
        public readonly rows: EventsReportRowDto[],
    ) {}
}
