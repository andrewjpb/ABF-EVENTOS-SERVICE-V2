export class UserReportRowDto {
    constructor(
        public readonly name: string,
        public readonly email: string,
        public readonly rg: string,
        public readonly cpf: string,
        public readonly company: string,
        public readonly position: string,
        public readonly active: boolean,
    ) {}
}
