// ==================== Hotm Entries ====================

import {StatSymbol} from "./symbols";

export interface HotmEntry {
  name: string,
  description: string,
}

export type HotmNodeNames =
// HOTM 10
  | "gemstone_infusion" | "crystalline" | "gifts_from_the_departed" | "mining_master"
  | "hungry_for_more" | "vanguard_seeker" | "sheer_force"
  // HOTM 9
  | "metal_head" | "rags_to_riches" | "eager_adventurer"
  // HOTM 8
  | "miners_blessing" | "no_stone_unturned" | "strong_arm" | "steady_hand"
  | "warm_hearted" | "surveyor" | "mineshaft_mayhem"
  // HOTM 7
  | "mining_speed_2" | "powder_buff" | "mining_fortune_2"
  // HOTM 6
  | "anomalous_desire" | "blockhead" | "subterranean_fisher" | "keep_it_cool"
  | "lonesome_miner" | "great_explorer" | "maniac_miner"
  // HOTM 5
  | "daily_grind" | "special_0" | "daily_powder"
  // HOTM 4
  | "daily_effect" | "old_school" | "professional" | "mole"
  | "fortunate" | "mining_experience" | "front_loaded"
  // HOTM 3
  | "random_event" | "efficient_miner" | "forge_time"
  // HOTM 2
  | "mining_speed_boost" | "precision_mining" | "mining_fortune"
  | "titanium_insanium" | "pickaxe_toss"
  // HOTM 1
  | "mining_speed";

// ==================== Upgradable Perks ====================
export interface NumberTuple {
  first: number,
  second: number,
}

export type PerkFunction = (level: number) => number | NumberTuple;
export type PowderFunction = (level: number) => number;

export enum PowderType {
  MITHRIL = "mithril",
  GEMSTONE = "gemstone",
  GLACITE = "glacite"
}

export enum PerkState {
  MAXED = 'diamond',
  PROGRESSING = 'emerald',
  LOCKED = 'coal'
}

interface GeneralPerk extends HotmEntry {
  // state: PerkState,
}

export interface StaticPerk extends GeneralPerk {

}

export interface DynamicPerk extends GeneralPerk {
  maxLevel: number,
  // currentLevel: number,
  perkFunc: PerkFunction,
  powderFunc: PowderFunction,
  powderType: PowderType,
}

export type LevelablePerk = StaticPerk | DynamicPerk;

// ==================== Abilities ====================

export enum AbilityState {
  UNLOCKED = 'emeraldblock',
  LOCKED = 'coalblock',
  CORE = 'redstoneblock' // Core of the mountain
}

export interface Ability extends HotmEntry {
  // state: AbilityState
}

// ==================== Each Node on tree ====================
// a slot can be a levelable perk, an ability or empty.
export interface Perk {
  perk: LevelablePerk | Ability;
  requires: HotmNodeNames[],
  position: { x: number, y: number }
  /* x ------------> 0-6
  *  y
  *  |
  *  |
  *  |
  *  V 0-9
  * */
}


// ==================== Data for the tree ====================
// #{1}, #{2} for the numbers
const StaticHotmData: Record<HotmNodeNames, Perk> = {
  "mining_speed": {
    perk: {
      name: 'Mining Speed',
      description: `§7Grants §6+#{1} ${StatSymbol.MINING_SPEED} Mining Speed§7.`,
      maxLevel: 50,
      perkFunc: (l: number) => l * 20,
      powderFunc: (l: number) => l
    },
    requires: [],
    position: {x: 3, y: 9}
  }
}

// https://github.com/SkyCryptWebsite/SkyCrypt/blob/development/src/constants/hotm.js#L1972
