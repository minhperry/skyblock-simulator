import { Cell } from "./cell";

export interface GameConfig<T> {
    grid: Cell<T>[][];
    started: boolean;
    readonly width: number;
    readonly height: number;
}
