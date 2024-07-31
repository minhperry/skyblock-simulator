export interface Cell<T> {
    state: CellState;
    value?: T;
}

export enum CellState {
    ON = 'green',
    OFF = 'red',
    NEXT = 'overlay',
}