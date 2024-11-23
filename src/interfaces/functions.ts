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
