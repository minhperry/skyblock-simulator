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

// Differentiate between AbilityState and PerkState


export interface Powder {
  mithril: number,
  gemstone: number,
  glacite: number
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
      perkFunc: l => ({first: l * 20, second: 0}),
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
      perkFunc: l => ({first: 2 + (l * 0.1), second: 0}),
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
      maxLevel: 20,
      perkFunc: l => ({first: l * 20, second: 0}),
      powderFunc: floorOfNextPlusOneExp(3.05),
      requires: [HotmNode.RANDOM_EVENT, HotmNode.PROFESSIONAL]
    },
    position: {x: 1, y: 6},
    state: InitialPerkState,
  },
  {
    id: HotmNode.PROFESSIONAL,
    perk: {
      name: 'Professional',
      description: `%GRAY%Gain %GOLD%+#{1} ${StatString.MINING_SPEED} %GRAY%while mining %PURPLE%Gemstones%GRAY%.`,
      maxLevel: 140,
      perkFunc: l => ({first: 50 + l * 5, second: 0}),
      powderFunc: floorOfNextPlusOneExp(2.3),
      requires: [HotmNode.MOLE, HotmNode.OLD_SCHOOL]
    },
    position: {x: 2, y: 6},
    state: InitialPerkState,
  },
  {
    id: HotmNode.MOLE,
    perk: {
      name: 'Mole',
      description: `%GRAY%Grants %YELLOW%+#{1} ${StatString.MINING_SPREAD}%GRAY% when mining Hard Stone.`,
      maxLevel: 200,
      perkFunc: l => ({first: 50 + (l - 1) * (350 / 199), second: 0}),
      powderFunc: floorOfNextPlusOneExp(2.17883),
      requires: [HotmNode.EFFICIENT_MINER, HotmNode.PROFESSIONAL, HotmNode.FORTUNATE]
    },
    position: {x: 3, y: 6},
    state: InitialPerkState,
  },
  {
    id: HotmNode.FORTUNATE,
    perk: {
      name: 'Gem Lover',
      description: `%GRAY%Grants %GOLD%+#{1} ${StatString.GEMSTONE_FORTUNE}%GRAY%.`,
      maxLevel: 20,
      perkFunc: l => ({first: l * 4 + 20, second: 0}),
      powderFunc: floorOfNextPlusOneExp(4),
      requires: [HotmNode.MOLE, HotmNode.MINING_EXPERIENCE]
    },
    position: {x: 4, y: 6},
    state: InitialPerkState,
  },
  {
    id: HotmNode.MINING_EXPERIENCE,
    perk: {
      name: 'Seasoned Mineman',
      description: `%GRAY%Grants %CYAN%+#{1} ${StatString.MINING_WISDOM}%GRAY%.`,
      maxLevel: 100,
      perkFunc: l => ({first: l * 0.1 + 5, second: 0}),
      powderFunc: floorOfNextPlusOneExp(2.3),
      requires: [HotmNode.FORTUNATE, HotmNode.FORGE_TIME]
    },
    position: {x: 5, y: 6},
    state: InitialPerkState
  },
  {
    id: HotmNode.FRONT_LOADED,
    perk: {
      name: 'Front Loaded',
      description: '%GRAY%Grants these buffs for the first %PURPLE%2500 Gemstones %GRAY%you mine each day:\n' +
        '%PURPLE%3x Gemstone Powder\n' +
        `%GOLD%+150 ${StatString.GEMSTONE_FORTUNE}\n` +
        `%GOLD%+250 ${StatString.MINING_SPEED}`,
      requires: [HotmNode.MINING_EXPERIENCE],
    },
    position: {x: 6, y: 6},
    state: InitialStaticPerkState,
  },
  // Hotm 5
  {
    id: HotmNode.DAILY_GRIND,
    perk: {
      name: 'Daily Grind',
      description: '%GRAY%Your first daily commission on each %AQUA%Mining Island %GRAY%grants %BLUE%+500 Powder %GRAY%multiplied by your %DPURPLE%HOTM level%GRAY%.',
      requires: [HotmNode.OLD_SCHOOL, HotmNode.BLOCKHEAD]
    },
    position: {x: 1, y: 5},
    state: InitialStaticPerkState,
  },
  {
    id: HotmNode.SPECIAL_0,
    perk: {
      name: 'Special 0',
      description: '%GRAY%Grants multiple perks. See wiki for more details, I can\'t be asked to write all with formatting. ' +
        'Plus it isn\'t levelable here anyways.',
      requires: [HotmNode.MOLE, HotmNode.KEEP_IT_COOL]
    },
    position: {x: 3, y: 5},
    state: InitialAbilityState
  },
  {
    id: HotmNode.DAILY_POWDER,
    perk: {
      name: 'Daily Powder',
      description: '%GRAY%Your first daily ore %GRAY%grants %BLUE%+500 Powder %GRAY%multiplied by your %DPURPLE%HOTM level%GRAY%.',
      requires: [HotmNode.GREAT_EXPLORER, HotmNode.MINING_EXPERIENCE]
    },
    position: {x: 5, y: 5},
    state: InitialStaticPerkState
  },
  // Hotm 6
  {
    id: HotmNode.ANOMALOUS_DESIRE,
    perk: {
      name: 'Anomalous Desire',
      description: 'Increases the chance of triggering rare occurrences by %YELLOW%+30% %GRAY%for %GREEN%30s%GRAY%.',
      requires: [HotmNode.BLOCKHEAD]
    },
    position: {x: 0, y: 4},
    state: InitialStaticPerkState
  },
  {
    id: HotmNode.BLOCKHEAD,
    perk: {
      name: 'Blockhead',
      description: `%GRAY%Grants %GOLD%+#{1} ${StatString.BLOCK_FORTUNE}%GRAY%.`,
      maxLevel: 20,
      perkFunc: l => ({first: l * 5, second: 0}),
      powderFunc: floorOfNextPlusOneExp(4),
      requires: [HotmNode.DAILY_GRIND, HotmNode.SUBTERRANEAN_FISHER, HotmNode.MINING_SPEED_2]
    },
    position: {x: 1, y: 4},
    state: InitialPerkState
  },
  {
    id: HotmNode.SUBTERRANEAN_FISHER,
    perk: {
      name: 'Subterranean Fisher',
      description: `%GRAY%Grants %AQUA%+#{1} ${StatString.FISHING_SPEED} %GRAY%and %CYAN%+#{2} ${StatString.SEA_CREATURE_CHANCE} %GRAY%\n` +
        'when in %DPURPLE%Crystal Hollows %GRAY%and %AQUA%Glacite Tunnels%GRAY%.',
      maxLevel: 40,
      perkFunc: l => ({first: 5 + l * 0.5, second: 1 + l * 0.1}),
      powderFunc: floorOfNextPlusOneExp(3.07),
      requires: [HotmNode.KEEP_IT_COOL, HotmNode.BLOCKHEAD]
    },
    position: {x: 2, y: 4},
    state: InitialPerkState
  },
  {
    id: HotmNode.KEEP_IT_COOL,
    perk: {
      name: 'Keep It Cool',
      description: `%GRAY%Grants %RED%+#{1} ${StatString.HEAT_RESISTANCE}%GRAY%.`,
      maxLevel: 50,
      perkFunc: l => ({first: l * 0.4, second: 0}),
      powderFunc: floorOfNextPlusOneExp(3.07),
      requires: [HotmNode.SPECIAL_0, HotmNode.POWDER_BUFF]
    },
    position: {x: 3, y: 4},
    state: InitialPerkState
  },
  {
    id: HotmNode.LONESOME_MINER,
    perk: {
      name: 'Lonesome Miner',
      description: `%GRAY%Increases %RED%${StatString.STRENGTH}%GRAY%, %BLUE%${StatString.CRIT_CHANCE}%GRAY%, %BLUE%${StatString.CRIT_DAMAGE}%GRAY%, ` +
        `%RED%${StatString.HEALTH} %GRAY%and %GREEN%${StatString.DEFENSE} %GRAY%by %GREEN%#{1}% while on %AQUA%Mining Islands%GRAY%.`,
      maxLevel: 45,
      perkFunc: l => ({first: 5 + (l - 1) * 0.5, second: 0}),
      powderFunc: floorOfNextPlusOneExp(3.07),
      requires: [HotmNode.KEEP_IT_COOL, HotmNode.GREAT_EXPLORER]
    },
    position: {x: 4, y: 4},
    state: InitialPerkState
  },
  {
    id: HotmNode.GREAT_EXPLORER,
    perk: {
      name: 'Great Explorer',
      description: `%GRAY%Boosts %BLUE%Treasure Chests %GRAY%chance in %DPURPLE%Crystal Hollows %GRAY%by %GREEN%#{1}%` +
        `%GRAY% and reduces the amount of locks by %GREEN%#{2}%GRAY%.`,
      maxLevel: 20,
      perkFunc: l => ({first: 20 + (l - 1) * 4, second: 1 + Math.floor(l / 5)}),
      powderFunc: floorOfNextPlusOneExp(4),
      requires: [HotmNode.LONESOME_MINER, HotmNode.DAILY_POWDER, HotmNode.MINING_FORTUNE_2]
    },
    position: {x: 5, y: 4},
    state: InitialPerkState
  },
  {
    id: HotmNode.MANIAC_MINER,
    perk: {
      name: 'Maniac Miner',
      description: `%GRAY%Grants %DGREEN%+1 Ⓟ Breaking Power %GRAY%and a stack of %GOLD%+5 ${StatString.MINING_FORTUNE} %DGRAY%(caps at 1000) %GRAY%per block broken for %GREEN%25s%GRAY%.` +
        ' Each block broken consumes %AQUA%20 Mana%GRAY%.',
      requires: [HotmNode.GREAT_EXPLORER]
    },
    position: {x: 6, y: 4},
    state: InitialAbilityState
  },
  // Hotm 7
  {
    id: HotmNode.MINING_SPEED_2,
    perk: {
      name: 'Speedy Mineman',
      description: `%GRAY%Grants %GOLD%+#{1} ${StatString.MINING_SPEED}%GRAY%.`,
      maxLevel: 50,
      perkFunc: l => ({first: l * 40, second: 0}),
      powderFunc: floorOfNextPlusOneExp(3.2),
      requires: [HotmNode.BLOCKHEAD, HotmNode.NO_STONE_UNTURNED]
    },
    position: {x: 1, y: 3},
    state: InitialPerkState
  },
  {
    id: HotmNode.POWDER_BUFF,
    perk: {
      name: 'Powder Buff',
      description: `%GRAY%Grants %GREEN%+#{1}% %GRAY%from any sources.`,
      maxLevel: 50,
      perkFunc: l => ({first: l, second: 0}),
      powderFunc: floorOfNextPlusOneExp(3.2),
      requires: [HotmNode.KEEP_IT_COOL, HotmNode.STEADY_HAND]
    },
    position: {x: 3, y: 3},
    state: InitialPerkState
  },
  {
    id: HotmNode.MINING_FORTUNE_2,
    perk: {
      name: 'Fortunate Mineman',
      description: `%GRAY%Grants %GOLD%+#{1} ${StatString.MINING_FORTUNE}%GRAY%.`,
      maxLevel: 50,
      perkFunc: l => ({first: l * 3, second: 0}),
      powderFunc: floorOfNextPlusOneExp(3.2),
      requires: [HotmNode.GREAT_EXPLORER, HotmNode.SURVEYOR]
    },
    position: {x: 5, y: 3},
    state: InitialPerkState
  },
  // Hotm 8
  {
    id: HotmNode.MINERS_BLESSING,
    perk: {
      name: 'Miner\'s Blessing',
      description: `%GRAY%Grants %AQUA%+30 ✯ Magic Find %GRAY%on all %AQUA%Mining Islands%GRAY%.`,
      requires: [HotmNode.NO_STONE_UNTURNED]
    },
    position: {x: 0, y: 2},
    state: InitialStaticPerkState
  },
  {
    id: HotmNode.NO_STONE_UNTURNED,
    perk: {
      name: 'No Stone Unturned',
      description: `%GRAY%Increases %BLUE%Suspicious Scrap %GRAY%chance by %GREEN%#{1} in %AQUA%Glacite Mineshafts %GRAY%.`,
      maxLevel: 50,
      perkFunc: l => ({first: l * 0.5, second: 0}),
      powderFunc: floorOfNextPlusOneExp(3.05),
      requires: [HotmNode.METAL_HEAD, HotmNode.STRONG_ARM, HotmNode.MINING_SPEED_2]
    },
    position: {x: 1, y: 2},
    state: InitialPerkState
  },
  {
    id: HotmNode.STRONG_ARM,
    perk: {
      name: 'Strong Arm',
      description: `%GRAY%Gains %GOLD%+#{1} ${StatString.MINING_SPEED}%GRAY% while mining %GOLD%Dwarven Metals%GRAY%.`,
      maxLevel: 100,
      perkFunc: l => ({first: l * 5, second: 0}),
      powderFunc: floorOfNextPlusOneExp(2.3),
      requires: [HotmNode.NO_STONE_UNTURNED, HotmNode.STEADY_HAND]
    },
    position: {x: 2, y: 2},
    state: InitialPerkState
  },
  {
    id: HotmNode.STEADY_HAND,
    perk: {
      name: 'Steady Hand',
      description: `%GRAY%Grants %YELLOW%+#{1} ${StatString.MINING_SPREAD} %GRAY%while in %AQUA%Glacite Mineshaft%GRAY%.`,
      maxLevel: 100,
      perkFunc: l => ({first: l * 0.1, second: 0}),
      powderFunc: floorOfNextPlusOneExp(2.6),
      requires: [HotmNode.STRONG_ARM, HotmNode.WARM_HEARTED, HotmNode.POWDER_BUFF, HotmNode.RAGS_TO_RICHES]
    },
    position: {x: 3, y: 2},
    state: InitialPerkState
  },
  {
    id: HotmNode.WARM_HEARTED,
    perk: {
      name: 'Warm Heart',
      description: `%GRAY%Grants %AQUA%+#{1} ${StatString.COLD_RESISTANCE}%GRAY%.`,
      maxLevel: 50,
      perkFunc: l => ({first: l * 0.4, second: 0}),
      powderFunc: floorOfNextPlusOneExp(3.1),
      requires: [HotmNode.SURVEYOR, HotmNode.STEADY_HAND]
    },
    position: {x: 4, y: 2},
    state: InitialPerkState
  }, {
    id: HotmNode.SURVEYOR,
    perk: {
      name: 'Surveyor',
      description: '%GRAY%Increases your chance of %AQUA%Glacite Mineshaft %GRAY%while mining in the %AQUA%Glacite Tunnels %GRAY% by %GREEN%+#{1}%%GRAY%.',
      maxLevel: 20,
      perkFunc: l => ({first: l * 0.75, second: 0}),
      powderFunc: floorOfNextPlusOneExp(4),
      requires: [HotmNode.WARM_HEARTED, HotmNode.EAGER_ADVENTURER, HotmNode.MINING_FORTUNE_2]
    },
    position: {x: 5, y: 2},
    state: InitialPerkState
  },
  {
    id: HotmNode.MINESHAFT_MAYHEM,
    perk: {
      name: 'Mineshaft Mayhem',
      description: 'Receives one random buff on joining a %AQUA%Glacite Mineshaft%GRAY%:\n' +
        '%GREEN%+5% %GRAY% chance for %BLUE%Suspicious Scrap\n' +
        `%GOLD%+100 ${StatString.MINING_FORTUNE}%GRAY%\n` +
        `%GOLD%+200 ${StatString.MINING_SPEED}%GRAY%\n` +
        `%GOLD%+10 ${StatString.COLD_RESISTANCE}%GRAY%\n` +
        '%GREEN%-25% %GRAY%Pickaxe Ability cooldown',
      requires: [HotmNode.SURVEYOR]
    },
    position: {x: 6, y: 2},
    state: InitialStaticPerkState
  },
  // Hotm 9
  {
    id: HotmNode.METAL_HEAD,
    perk: {
      name: 'Metal Head',
      description: `%GRAY%Grants %GOLD%+#{1} ${StatString.DWARVEN_METAL_FORTUNE}%GRAY%.`,
      maxLevel: 20,
      perkFunc: l => ({first: l * 5, second: 0}),
      powderFunc: floorOfNextPlusOneExp(4),
      requires: [HotmNode.NO_STONE_UNTURNED, HotmNode.CRYSTALLINE]
    },
    position: {x: 1, y: 1},
    state: InitialPerkState
  },
  {
    id: HotmNode.RAGS_TO_RICHES,
    perk: {
      name: 'Rags to Riches',
      description: `%GRAY%Grants %GOLD%+#{1} ${StatString.MINING_FORTUNE} %GRAY%while in a %AQUA%Glacite Mineshaft.`,
      maxLevel: 50,
      perkFunc: l => ({first: l * 4, second: 0}),
      powderFunc: floorOfNextPlusOneExp(3.05),
      requires: [HotmNode.MINING_MASTER, HotmNode.STEADY_HAND]
    },
    position: {x: 3, y: 1},
    state: InitialPerkState
  },
  {
    id: HotmNode.EAGER_ADVENTURER,
    perk: {
      name: 'Eager Adventurer',
      description: `%GRAY%Grants %GOLD%+#{1} ${StatString.MINING_SPEED}%GRAY% while in a %AQUA%Glacite Mineshafts%GRAY%.`,
      maxLevel: 100,
      perkFunc: l => ({first: l * 4, second: 0}),
      powderFunc: floorOfNextPlusOneExp(2.3),
      requires: [HotmNode.VANGUARD_SEEKER, HotmNode.SURVEYOR]
    },
    position: {x: 5, y: 1},
    state: InitialPerkState
  },
  // Hotm 10
  {
    id: HotmNode.GEMSTONE_INFUSION,
    perk: {
      name: 'Gemstone Infusion',
      description: '%GRAY%Increases the effectiveness of %GOLD%every Gemstone %GRAY%in your pick\'s Gemstone Slots by %GREEN%100% %GRAY%for %GREEN%20s%GRAY%.',
      requires: [HotmNode.CRYSTALLINE]
    },
    position: {x: 0, y: 0},
    state: InitialAbilityState
  },
  {
    id: HotmNode.CRYSTALLINE,
    perk: {
      name: 'Crystalline',
      description: `%GRAY%Increases your chances of finding a %AQUA%Glacite Mineshaft %GRAY%containing a %PURPLE%Gemstone Crystal %GRAY%by %GREEN%#{1}%%GRAY%.`,
      maxLevel: 50,
      perkFunc: l => ({first: l * 0.5, second: 0}),
      powderFunc: floorOfNextPlusOneExp(3.3),
      requires: [HotmNode.METAL_HEAD, HotmNode.GIFTS_FROM_THE_DEPARTED]
    },
    position: {x: 1, y: 0},
    state: InitialPerkState
  },
  {
    id: HotmNode.GIFTS_FROM_THE_DEPARTED,
    perk: {
      name: 'Gifts from the Departed',
      description: `%GRAY%Gain a %GREEN%0.2% %GRAY%chance to get an extra item when looting a %AQUA%Frozen Corpse%GRAY%.`,
      maxLevel: 100,
      perkFunc: l => ({first: 0.2 * l, second: 0}),
      powderFunc: floorOfNextPlusOneExp(2.45),
      requires: [HotmNode.CRYSTALLINE, HotmNode.MINING_MASTER]
    },
    position: {x: 2, y: 0},
    state: InitialPerkState
  },
  {
    id: HotmNode.MINING_MASTER,
    perk: {
      name: 'Mining Master',
      description: `%GRAY%Grants %DPURPLE%+#{1} ${StatString.PRISTINE}%GRAY%.`,
      maxLevel: 10,
      perkFunc: l => ({first: l * 0.1, second: 0}),
      powderFunc: p => Math.floor(Math.pow(p + 7, 5)),
      requires: [HotmNode.GIFTS_FROM_THE_DEPARTED, HotmNode.HUNGRY_FOR_MORE]
    },
    position: {x: 3, y: 0},
    state: InitialPerkState
  },
  {
    id: HotmNode.HUNGRY_FOR_MORE,
    perk: {
      name: 'Dead Man\'s Chest',
      description: `%GRAY%Gain a %GREEN%#{1}% %GRAY%chance to spawn %GREEN%1 %GRAY%additional %AQUA%Frozen Corpse %GRAY%when you enter a %AQUA%Glacite Mineshaft%GRAY%.`,
      maxLevel: 50,
      perkFunc: l => ({first: l, second: 0}),
      powderFunc: floorOfNextPlusOneExp(3.2),
      requires: [HotmNode.MINING_MASTER, HotmNode.VANGUARD_SEEKER]
    },
    position: {x: 4, y: 0},
    state: InitialPerkState
  },
  {
    id: HotmNode.VANGUARD_SEEKER,
    perk: {
      name: 'Vanguard Seeker',
      description: `%GRAY%Increases %PURPLE%Fairy Mineshaft %GRAY%chance with %WHITE%Vanguard Corpse %GRAY%by %GREEN%#{1}%%GRAY%.`,
      maxLevel: 50,
      perkFunc: l => ({first: l, second: 0}),
      powderFunc: floorOfNextPlusOneExp(3.1),
      requires: [HotmNode.HUNGRY_FOR_MORE, HotmNode.EAGER_ADVENTURER]
    },
    position: {x: 5, y: 0},
    state: InitialPerkState
  },
  {
    id: HotmNode.SHEER_FORCE,
    perk: {
      name: 'Sheer Force',
      description: `%GRAY%Grants %YELLOW%+200 ${StatString.MINING_SPREAD} %GRAY%for %GREEN%20s%GRAY%.`,
      requires: [HotmNode.VANGUARD_SEEKER]
    },
    position: {x: 6, y: 0},
    state: InitialAbilityState
  }
]

// https://github.com/SkyCryptWebsite/SkyCrypt/blob/development/src/constants/hotm.js#L1972