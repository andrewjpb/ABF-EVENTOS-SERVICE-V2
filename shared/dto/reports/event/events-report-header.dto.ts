export class EventsReportHeaderDto {
    constructor(
        public readonly total: number,
        public readonly inPerson?: number,
        public readonly online?: number,
        public readonly hybrid?: number,
        public readonly external?: number,
    ) {}
}
