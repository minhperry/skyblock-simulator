export interface Cell {
    state: CellState;
    number?: number;
}

export enum CellState {
    ON = 'green',
    OFF = 'red',
    NEXT = 'overlay',
}