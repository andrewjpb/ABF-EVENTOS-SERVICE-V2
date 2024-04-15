export class StringUtils {
    public static isNumeric(value: string): boolean {
        return !isNaN(parseInt(value)) && !isNaN(parseFloat(value));
    }

    public static padLeft(value: number): string {
        if (value.toString().length < 2) {
            return `0${value}`;
        }
        return value.toString();
    }
}
