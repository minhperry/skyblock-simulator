import { Cell } from "./cell";

export interface GameConfig<T> {
    grid: Cell<T>[][];
    started: boolean;
    width: number;
    height: number;
}
