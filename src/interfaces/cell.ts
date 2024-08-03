export interface Cell<T> {
    state: CellState;
    value?: T;
}

export enum CellState {
    ON = 'green',
    OFF = 'red',
    NEXT = 'yellow',
    ONE = 'blue',
    TWO = 'purple',
    THREE = 'cyan',
    NONE = ''
}

export const next = (curr: CellState): CellState => {
    switch (curr) {
        case CellState.ONE:
            return CellState.TWO;            
        case CellState.TWO:
            return CellState.THREE;
        case CellState.THREE:
            return CellState.ONE;
        default:
            return CellState.NONE;
    }
}

export const random = (): CellState => {
    const states = [CellState.ONE, CellState.TWO, CellState.THREE];
    return states[Math.floor(Math.random() * states.length)];
}