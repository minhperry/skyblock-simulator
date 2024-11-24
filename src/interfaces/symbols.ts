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
}

export enum StatString {
  // Base mining stats
  MINING_SPEED = `${StatSymbol.MINING_SPEED} Mining Speed`,
  MINING_FORTUNE = `${StatSymbol.FORTUNE} Mining Fortune`,

  // Spreads
  GEMSTONE_SPREAD = `${StatSymbol.MINING_SPREAD} Gemstone Spread`,
  MINING_SPREAD = `${StatSymbol.MINING_SPREAD} Mining Spread`,

  // Subfortunes
  ORE_FORTUNE = `${StatSymbol.FORTUNE} Ore Fortune`,
  BLOCK_FORTUNE = `${StatSymbol.FORTUNE} Block Fortune`,
  DWARVEN_METAL_FORTUNE = `${StatSymbol.FORTUNE} Dwarven Metal Fortune`,
  GEMSTONE_FORTUNE = `${StatSymbol.FORTUNE} Gemstone Fortune`,

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