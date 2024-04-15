export class Result {
    constructor(
        public message: string,
        public data: any,
        public error: Error,
    ) {}
}
