export class ResetTokenDto {
    constructor(public userId: string, public ttl: Date, public used: boolean) {}
}
