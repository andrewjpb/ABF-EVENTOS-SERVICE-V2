export class EmailDto {
    constructor(
        public name: string,
        public destinatary: string,
        public subject: string,
        public body: string,
    ) {}
}
