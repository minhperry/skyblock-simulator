// ==================== Mcow vs Ele ====================

type BinaryFunction<I, O> = (input: I) => O;

export type NumNumFunc = BinaryFunction<number, number>;
export type BoolNumFunc = BinaryFunction<boolean, number>;

export type NumStringFunc = BinaryFunction<number, string>;

export type NumOrZero = number | 0;

export const identity: NumNumFunc = (v) => v;

// ==================== Hotm ====================

export interface NumberTuple {
    first: number,
    second: number,
}

export type PerkFunction = (level: number) => NumberTuple;
export type PowderFunction = (level: number) => number;

export function floorOfNextPlusOneExp(exp: number): (v: number) => number {
    return (v: number) => Math.floor(Math.pow(v + 1, exp));
}

export function round(num: number) {
    return Math.round(num * 100) / 100;
}

export function zeroOr(v: number, state: boolean) {
    return state ? v : 0;
}

export function formatDecimalNoTrailingZero(num: number, decimalPlaces = 2) {
    // Convert to fixed decimal string
    const fixed = Number(num).toFixed(decimalPlaces);

    // Check if it's an integer value (all 0s after decimal)
    if (fixed.indexOf('.') > 0) {
        // Remove trailing zeros
        return fixed.replace(/\.?0+$/, '');
    }

    return fixed;
}