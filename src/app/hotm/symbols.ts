enum StatSymbol {
  // Mining stats
  MINING_SPEED = '⸕',
  MINING_SPREAD = '▚',
  FORTUNE = '☘',
  HEAT_RES = '♨',
  COLD_RES = '❄',
  PRISTINE = '✧',
  // Combat stats
  STRENGTH = '❁',
  CRIT_CHANCE = '☣',
  CRIT_DAMAGE = '☠',
  DEFENSE = '❈',
  HEALTH = '❤',
  WISDOM = '☯',
  FISHING_SPEED = '☂',
  SEA_CREATURE_CHANCE = 'α',
}

export enum StatString {
  // Base mining stats
  MINING_SPEED = `${StatSymbol.MINING_SPEED} Mining Speed`,
  MINING_FORTUNE = `${StatSymbol.FORTUNE} Mining Fortune`,
  PRISTINE = `${StatSymbol.PRISTINE} Pristine`,

  // Spreads
  GEMSTONE_SPREAD = `${StatSymbol.MINING_SPREAD} Gemstone Spread`,
  MINING_SPREAD = `${StatSymbol.MINING_SPREAD} Mining Spread`,

  // Subfortunes
  ORE_FORTUNE = `${StatSymbol.FORTUNE} Ore Fortune`,
  BLOCK_FORTUNE = `${StatSymbol.FORTUNE} Block Fortune`,
  DWARVEN_METAL_FORTUNE = `${StatSymbol.FORTUNE} Dwarven Metal Fortune`,
  GEMSTONE_FORTUNE = `${StatSymbol.FORTUNE} Gemstone Fortune`,

  // Wisdom
  MINING_WISDOM = `${StatSymbol.WISDOM} Mining Wisdom`,

  // Fishing
  FISHING_SPEED = `${StatSymbol.FISHING_SPEED} Fishing Speed`,
  SEA_CREATURE_CHANCE = `${StatSymbol.SEA_CREATURE_CHANCE} Sea Creature Chance`,

  // Resistance
  HEAT_RESISTANCE = `${StatSymbol.HEAT_RES} Heat Resistance`,
  COLD_RESISTANCE = `${StatSymbol.COLD_RES} Cold Resistance`,

  // Combat stats
  STRENGTH = `${StatSymbol.STRENGTH} Strength`,
  CRIT_CHANCE = `${StatSymbol.CRIT_CHANCE} Crit Chance`,
  CRIT_DAMAGE = `${StatSymbol.CRIT_DAMAGE} Crit Damage`,
  DEFENSE = `${StatSymbol.DEFENSE} Defense`,
  HEALTH = `${StatSymbol.HEALTH} Health`,
}

export enum PowderString {
  MITHRIL = '§2#{#} Mithril Powder',
  GEMSTONE = '§d#{#} Gemstone Powder',
  GLACITE = '§b#{#} Glacite Powder',
}