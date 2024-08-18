export interface Cell<T> {
    state: CellState;
    value?: T;
}

export enum CellState {
    ON = 'green',
    OFF = 'red',
    NEXT = 'yellow',
    OVERNEXT = 'orange',
    ONE = 'darkgreen',
    TWO = 'blue',
    THREE = OFF,
    FOUR = OVERNEXT,
    FIVE = NEXT,
    NONE = ''
}

export const next = (curr: CellState): CellState => {
    switch (curr) {
        case CellState.ONE:
            return CellState.TWO;            
        case CellState.TWO:
            return CellState.THREE;
        case CellState.THREE:
            return CellState.FOUR;
        case CellState.FOUR:
            return CellState.FIVE;
        case CellState.FIVE:
            return CellState.ONE;
        default:
            return CellState.NONE;
    }
}

export const random = (): CellState => {
    const states = [CellState.ONE, CellState.TWO, CellState.THREE, CellState.FOUR, CellState.FIVE];
    return states[Math.floor(Math.random() * states.length)];
}