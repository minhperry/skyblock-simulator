import {HotmNodeNames} from "./constantData";

interface Node {
  node: HotmNodeNames
}

export enum AbilityState {
  UNLOCKED = 'emeraldblock',
  LOCKED = 'coalblock',
  CORE = 'redstoneblock' // Core of the mountain
}

export interface Ability extends Node {
  state: AbilityState;
}

export enum PerkState {
  MAXED = 'diamond',
  PROGRESSING = 'emerald',
  LOCKED = 'coal'
}

export interface DynamicPerk extends Node {
  state: PerkState;
  node: HotmNodeNames,
  level: number
}

export interface DisplayPerk {
  perk: Ability | DynamicPerk,
  requires: HotmNodeNames[]
  /* x ------------> 0-6
  *  y
  *  |
  *  |
  *  |
  *  V 0-9
  * */
}
