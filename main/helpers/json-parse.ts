export function tryJsonParse<T>(str: string): T {
    try {
        return JSON.parse(str);
    } catch (e) {
        return null;
    }
}