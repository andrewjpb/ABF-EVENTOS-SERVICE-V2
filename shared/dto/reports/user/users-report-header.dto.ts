export class UsersReportHeaderDto {
    constructor(
        public readonly totalUsers: number,
        public readonly activeUsers: number,
        public readonly inactiveUsers: number,
    ) {}
}
