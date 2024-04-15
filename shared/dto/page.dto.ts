export class PageDto<Type> {
    constructor(public readonly total: number, public readonly page: Type[]) {}
}
