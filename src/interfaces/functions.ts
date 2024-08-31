type BinaryFunction<I, O> = (input: I) => O;

export type NumNumFunc = BinaryFunction<number, number>;
export type BoolNumFunc = BinaryFunction<boolean, number>;

export type NumStringFunc = BinaryFunction<number, string>;

export type NumOrZero = number | 0;

export const defaultFunction: NumNumFunc = (v) => v;