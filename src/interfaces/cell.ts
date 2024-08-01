export interface Cell<T> {
    state: CellState;
    value?: T;
}

export enum CellState {
    ON = 'green',
    OFF = 'red',
    NEXT = 'yellow',
}

type TupleNumStr = [number, string];

export const CellNumber: { [key: string]: TupleNumStr } = {
    ONE: [1, 'blue'],
    TWO: [2, 'orange'],
    THREE: [3, 'darkgreen']
}