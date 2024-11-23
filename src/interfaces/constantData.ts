import {StatSymbolString} from "./symbols";
import {floorOfNextPlusOneExp, PerkFunction, PowderFunction} from "./functions";

// ==================== The very base ====================
// Basically is the smallest definable unit

export enum HotmNode {
  // HOTM 10
  GEMSTONE_INFUSION = "gemstone_infusion",
  CRYSTALLINE = "crystalline",
  GIFTS_FROM_THE_DEPARTED = "gifts_from_the_departed",
  MINING_MASTER = "mining_master",
  HUNGRY_FOR_MORE = "hungry_for_more",
  VANGUARD_SEEKER = "vanguard_seeker",
  SHEER_FORCE = "sheer_force",

  // HOTM 9
  METAL_HEAD = "metal_head",
  RAGS_TO_RICHES = "rags_to_riches",
  EAGER_ADVENTURER = "eager_adventurer",

  // HOTM 8
  MINERS_BLESSING = "miners_blessing",
  NO_STONE_UNTURNED = "no_stone_unturned",
  STRONG_ARM = "strong_arm",
  STEADY_HAND = "steady_hand",
  WARM_HEARTED = "warm_hearted",
  SURVEYOR = "surveyor",
  MINESHAFT_MAYHEM = "mineshaft_mayhem",

  // HOTM 7
  MINING_SPEED_2 = "mining_speed_2",
  POWDER_BUFF = "powder_buff",
  MINING_FORTUNE_2 = "mining_fortune_2",

  // HOTM 6
  ANOMALOUS_DESIRE = "anomalous_desire",
  BLOCKHEAD = "blockhead",
  SUBTERRANEAN_FISHER = "subterranean_fisher",
  KEEP_IT_COOL = "keep_it_cool",
  LONESOME_MINER = "lonesome_miner",
  GREAT_EXPLORER = "great_explorer",
  MANIAC_MINER = "maniac_miner",

  // HOTM 5
  DAILY_GRIND = "daily_grind",
  SPECIAL_0 = "special_0",
  DAILY_POWDER = "daily_powder",

  // HOTM 4
  DAILY_EFFECT = "daily_effect",
  OLD_SCHOOL = "old_school",
  PROFESSIONAL = "professional",
  MOLE = "mole",
  FORTUNATE = "fortunate",
  MINING_EXPERIENCE = "mining_experience",
  FRONT_LOADED = "front_loaded",

  // HOTM 3
  RANDOM_EVENT = "random_event",
  EFFICIENT_MINER = "efficient_miner",
  FORGE_TIME = "forge_time",

  // HOTM 2
  MINING_SPEED_BOOST = "mining_speed_boost",
  PRECISION_MINING = "precision_mining",
  MINING_FORTUNE = "mining_fortune",
  TITANIUM_INSANIUM = "titanium_insanium",
  PICKAXE_TOSS = "pickaxe_toss",

  // HOTM 1
  MINING_SPEED = "mining_speed",
}

export enum PerkState {
  MAXED = 'diamond',
  PROGRESSING = 'emerald',
  LOCKED = 'coal'
}

export enum AbilityState {
  UNLOCKED = 'emeraldblock',
  LOCKED = 'coalblock',
  CORE = 'redstoneblock' // Core of the mountain
}

export enum PowderType {
  MITHRIL = "mithril",
  GEMSTONE = "gemstone",
  GLACITE = "glacite"
}

// ==================== Static Perk Data ====================

export interface Perk {
  name: string,
  description: string,
  maxLevel?: number,
  perkFunc?: PerkFunction,
  powderFunc?: PowderFunction,
  powderType?: PowderType,
  requires: HotmNode[]
}

interface Position {
  x: number,
  y: number
}

// ==================== Dynamic Perk Data ====================

interface NodeState {
  state: PerkState | AbilityState;
  currentLevel?: number;
}

// ==================== Combined Perk Data ====================

export interface TreeNode {
  id: HotmNode,
  position: Position,
  perk: Perk,
  state: NodeState
}

// ==================== Define datas here ====================

const InitialPerkState: NodeState = {
  state: PerkState.LOCKED,
  currentLevel: 0,
}

const InitialStaticPerkState: NodeState = {
  state: PerkState.LOCKED,
}

const InitialAbilityState: NodeState = {
  state: AbilityState.LOCKED,
}

// #{1}, #{2} for the numbers
export const InitialHotmTree: TreeNode[] = [
  // Hotm 1
  {
    id: HotmNode.MINING_SPEED,
    perk: {
      name: 'Mining Speed',
      description: `§7Grants §6+#{1} ${StatSymbolString.MINING_SPEED}§7.`,
      maxLevel: 50,
      perkFunc: l => l * 20,
      powderFunc: floorOfNextPlusOneExp(3),
      powderType: PowderType.MITHRIL,
      requires: [],
    },
    position: {x: 3, y: 9},
    state: InitialPerkState
  },
  // Hotm 2
  {
    id: HotmNode.MINING_SPEED_BOOST,
    perk: {
      name: 'Mining Speed Boost',
      description: `§7Grants §6+250% ${StatSymbolString.MINING_SPEED} for §a15s§7.`,
      requires: [HotmNode.PRECISION_MINING]
    },
    position: {x: 1, y: 8},
    state: InitialAbilityState,
  },
  {
    id: HotmNode.PRECISION_MINING,
    perk: {
      name: 'Precision Mining',
      description: `§7Aiming at particle increases your §6${StatSymbolString.MINING_SPEED} by §a30%§7.`,
      requires: [HotmNode.MINING_FORTUNE]
    },
    position: {x: 2, y: 8},
    state: InitialStaticPerkState
  },
  {
    id: HotmNode.MINING_FORTUNE,
    perk: {
      name: 'Mining Fortune',
      description: `§7Grants §6+#{1} ${StatSymbolString.FORTUNE}§7.`,
      maxLevel: 50,
      perkFunc: l => l * 2,
      powderFunc: floorOfNextPlusOneExp(3.05),
      powderType: PowderType.MITHRIL,
      requires: [HotmNode.MINING_SPEED]
    },
    position: {x: 3, y: 8},
    state: InitialPerkState
  }
]

// https://github.com/SkyCryptWebsite/SkyCrypt/blob/development/src/constants/hotm.js#L1972
