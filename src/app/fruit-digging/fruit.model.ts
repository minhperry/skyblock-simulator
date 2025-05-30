export enum Fruit {
  MANGO = 'mango',
  APPLE = 'apple',
  WATERMELON = 'watermelon',
  POMEGRANATE = 'pomegranate',
  COCONUT = 'coconut',
  CHERRY = 'cherry',
  DRAGONFRUIT = 'dragonfruit',
  DURIAN = 'durian'
}

export enum Bomb { BOMB = 'bomb' }

export enum Rum { RUM = 'rum' }

export enum State {
  HIDDEN = 'sand',
  DESTROYED = 'gone'
}

export type FruitCell = Fruit | Bomb | Rum | State

export enum ShovelMode {
  ANCHOR = 'anchor',
  MINES = 'mines',
  TREASURE = 'treasure',
}

