export enum CompareResult {
    AIsBigger = 1,
    BIsBigger = -1,
    Same = 0
}

export function versionCompare(a: string, b: string) {
    const pa = a.split('.');
    const pb = b.split('.');
    for (let i = 0; i < 3; i++) {
        const na = Number(pa[i]);
        const nb = Number(pb[i]);
        if (na > nb) return CompareResult.AIsBigger;
        if (nb > na) return CompareResult.BIsBigger;
        if (!isNaN(na) && isNaN(nb)) return CompareResult.AIsBigger;
        if (isNaN(na) && !isNaN(nb)) return CompareResult.BIsBigger;
    }
    return CompareResult.Same;
}
