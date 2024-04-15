export class EventsReportRowDto {
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly summary: string,
        public readonly description: string,
        public readonly format: string,
        public readonly date: string,
        public readonly users: number,
        public readonly speakers: number,
        public readonly sponsors: number,
        public readonly supporters: number,
        public readonly state: string,
        public readonly city: string,
    ) {}
}
