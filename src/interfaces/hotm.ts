export enum PerkState {
  MAXED = 'diamond',
  PROGRESSING = 'emerald',
  LOCKED = 'coal'
}

export interface StaticPerk {
  state: PerkState,
  name: string,
}

export interface DynamicPerk {
  state: PerkState,
  maxLevel: number,
  currentLevel: number,
  func: PerkFunction,
  name: string,
}

export enum AbilityState {
  UNLOCKED = 'emeraldblock',
  LOCKED = 'coalblock'
}

export enum Ability {

}

export interface NumberTuple {
  first: number,
  second: number,
}

export type PerkFunction = (level: number) => number | NumberTuple;
