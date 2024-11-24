import {StatString} from "./symbols";
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
// hotm 1-3 is mithril, 4-7 is gemstone, 8-10 is glacite
// y =  9-7             6-3              2-0
export interface Perk {
  name: string,
  description: string,
  maxLevel?: number,
  perkFunc?: PerkFunction,
  powderFunc?: PowderFunction,
  //powderType?: PowderType,
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
  currentLevel: 1,
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
      description: `%GRAY%Grants %GOLD%+#{1} ${StatString.MINING_SPEED}%GRAY%.`,
      maxLevel: 50,
      perkFunc: l => ({first: l + 20, second: 0}),
      powderFunc: floorOfNextPlusOneExp(3),
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
      description: `%GRAY%Grants %GOLD%+250% ${StatString.MINING_SPEED}%GRAY% for %GREEN%15s%GRAY%.`,
      requires: [HotmNode.PRECISION_MINING]
    },
    position: {x: 1, y: 8},
    state: InitialAbilityState,
  },
  {
    id: HotmNode.PRECISION_MINING,
    perk: {
      name: 'Precision Mining',
      description: `%GRAY%Aiming at particle increases your %GOLD%${StatString.MINING_SPEED} by %GREEN%30%%GRAY%.`,
      requires: [HotmNode.MINING_FORTUNE]
    },
    position: {x: 2, y: 8},
    state: InitialStaticPerkState
  },
  {
    id: HotmNode.MINING_FORTUNE,
    perk: {
      name: 'Mining Fortune',
      description: `%GRAY%Grants %GOLD%+#{1} ${StatString.MINING_FORTUNE}%GRAY%.`,
      maxLevel: 50,
      perkFunc: l => ({first: l * 20, second: 0}),
      powderFunc: floorOfNextPlusOneExp(3.05),
      requires: [HotmNode.MINING_SPEED]
    },
    position: {x: 3, y: 8},
    state: InitialPerkState
  },
  {
    id: HotmNode.TITANIUM_INSANIUM,
    perk: {
      name: 'Titanium Insanium',
      description: `%GRAY%Has a %GREEN%#{1}%%GRAY% chance to convert a block into %WHITE%Titanium Ore%GRAY% while mining %DGREEN%Mithril Ore%GRAY%.`,
      maxLevel: 50,
      perkFunc: l => ({first: 2 * (l + 1), second: 0}),
      powderFunc: floorOfNextPlusOneExp(3.1),
      requires: [HotmNode.MINING_FORTUNE]
    },
    position: {x: 4, y: 8},
    state: InitialPerkState
  },
  {
    id: HotmNode.PICKAXE_TOSS,
    perk: {
      name: 'Pickobulus',
      description: `%GRAY%Throw a pickaxe mining all ores in a %GREEN%3%GRAY% block radius.`,
      requires: [HotmNode.TITANIUM_INSANIUM]
    },
    position: {x: 5, y: 8},
    state: InitialAbilityState,
  },
  // Hotm 3
  {
    id: HotmNode.RANDOM_EVENT,
    perk: {
      name: 'Luck of the Cave',
      description: '%GREEN%#{1}% %GRAY%chance to trigger one rare occurence while mining:\n' +
        '%GOLD%Golden Goblin \n %DPURPLE%Fallen Stars \n %GOLD%Powder Ghast%GRAY%',
      maxLevel: 45,
      perkFunc: l => ({first: 5 + l, second: 0}),
      powderFunc: floorOfNextPlusOneExp(3.07),
      requires: [HotmNode.MINING_SPEED_BOOST]
    },
    position: {x: 1, y: 7},
    state: InitialPerkState,
  },
  {
    id: HotmNode.EFFICIENT_MINER,
    perk: {
      name: 'Efficient Miner',
      description: `%GRAY%Grants %YELLOW%+#{1} ${StatString.MINING_SPREAD}%GRAY%.`,
      maxLevel: 100,
      perkFunc: l => ({first: l * 3, second: 0}),
      powderFunc: floorOfNextPlusOneExp(2.6),
      requires: [HotmNode.MINING_FORTUNE]
    },
    position: {x: 3, y: 7},
    state: InitialPerkState,
  },
  {
    id: HotmNode.FORGE_TIME,
    perk: {
      name: 'Quick Forge',
      description: `%GRAY%Reduces the time it takes to forge by %GREEN%#{1}%%GRAY%.`,
      maxLevel: 20,
      perkFunc: l => ({first: Math.min(30, 10 + l * 0.5 + Math.floor(l / 20) * 10), second: 0}),
      powderFunc: floorOfNextPlusOneExp(3.2),
      requires: [HotmNode.PICKAXE_TOSS]
    },
    position: {x: 5, y: 7},
    state: InitialPerkState,
  },
  // Hotm 4
  {
    id: HotmNode.DAILY_EFFECT,
    perk: {
      name: 'Daily Effect',
      description: '%GRAY%Gains one random buff every Skyblock Day on any %AQUA%Mining Island%GRAY%:\n' +
        `%GOLD%+100 ${StatString.MINING_SPEED}%GRAY%.\n` +
        `%GOLD%+50 ${StatString.MINING_FORTUNE}%GRAY%.\n` +
        '%GREEN%15% %GRAY%more Powder while mining.\n' +
        '%GREEN%-20% %GRAY%Pickaxe Ability cooldown.\n' +
        '%GREEN%10x %GRAY%chance to spawn %GOLD%Golden %GRAY%and %AQUA%Diamond Goblins%GRAY%.\n' +
        '%GREEN%5x %BLUE%Titanium %GRAY%drops.'
      ,
      requires: [HotmNode.OLD_SCHOOL]
    },
    position: {x: 0, y: 6},
    state: InitialStaticPerkState,
  },
  {
    id: HotmNode.OLD_SCHOOL,
    perk: {
      name: 'Old School',
      description: `%GRAY%Grants %GOLD%+#{1} ${StatString.ORE_FORTUNE}%GRAY%.`,
      maxLevel: 50,
      perkFunc: l => ({first: l * 20, second: 0}),
      powderFunc: floorOfNextPlusOneExp(3.05),
      requires: [HotmNode.RANDOM_EVENT, HotmNode.PROFESSIONAL]
    },
    position: {x: 1, y: 6},
    state: InitialPerkState,
  },


  // Hotm 10
  {
    id: HotmNode.MINING_MASTER,
    perk: {
      name: 'Mining Master',
      description: `%GRAY%Grants %DPURPLE%#{1} ${StatString.PRISTINE}%GRAY%.`,
      maxLevel: 10,
      perkFunc: l => ({first: l * 0.1, second: 0}),
      powderFunc: p => Math.floor(Math.pow(p + 7, 5)),
      requires: [HotmNode.RAGS_TO_RICHES]
    },
    position: {x: 3, y: 0},
    state: InitialPerkState
  }
]

// https://github.com/SkyCryptWebsite/SkyCrypt/blob/development/src/constants/hotm.js#L1972