export interface Mayor {
  name: string,
  imageSrc?: string,
  perks?: Perk[],
}

/**
 * Represents the data of a mayor in the game.
 */
export class MayorData {
  private readonly _mayor: Mayor
  private readonly _start: number // unix time
  private readonly _end: number // + 6 hours
  private readonly _event?: MayorEvent

  constructor(may: Mayor, startTime: number, event?: MayorEvent) {
    this._mayor = may
    this._start = startTime
    this._end = startTime + 6 * HOUR
    this._event = event
  }

  get startTime(): number {
    return this._start
  }

  get endTime(): number {
    return this._end
  }

  get mayor(): Mayor {
    return this._mayor
  }

  get event(): MayorEvent | undefined {
    return this._event
  }
}

export class MayorEvent {
  private readonly _start: number
  private readonly _duration: number
  private readonly _name: string

  constructor(mayorStart: number, duration: number, eventName: string) {
    this._start = mayorStart + 15 * MINUTE
    this._duration = duration
    this._name = eventName
  }

  get start(): number {
    return this._start
  }

  get end(): number {
    return this._start + this._duration
  }

  get duration(): number {
    return this._duration
  }

  get eventName(): string {
    return this._name
  }
}

export interface Perk {
  name: string;
  desc: string;
}

export const DAY = 86400
export const HOUR = 3600
export const MINUTE = 60

export const MAYOR_PERKS_DATA:
  Record<string, {
      imageSrc?: string,
      eventDuration?: number,
      eventMessage?: string,
      perks?: Perk[]
    }> = {
  'Aatrox': {
    imageSrc: '/mayor/aatrox.png',
    perks: [
      {
        name: 'Slayer XP Buff',
        desc: '25% more Slayer XP.'
      }, {
        name: 'Pathfinder',
        desc: 'Gain rare drops 20% more often.'
      }, {
        name: 'SLASHED Pricing',
        desc: 'Slayers are half price.'
      }
    ]
  },
  'Cole': {
    imageSrc: '/mayor/cole.png',
    eventDuration: 140 * MINUTE,
    eventMessage: 'Mining Fiesta',
    perks: [
      {
        name: 'Mining Fiesta',
        desc: 'A fiesta for 7 Skyblock Days. Gains 75 Mining Wisdom, 2x drops, Refined Minerals and Glossy Gemstones.'
      }, {
        name: 'Mining XP Buff',
        desc: '60 Mining Wisdom on public islands.'
      }, {
        name: 'Molten Forge',
        desc: '25% less Forge time.'
      }, {
        name: 'Prospection',
        desc: 'Mining minions works 25% faster.'
      }
    ]
  },
  'Diana': {
    imageSrc: '/mayor/diana.png',
    perks: [
      {
        name: 'Pet XP Buff',
        desc: '35% more Pet XP.'
      }, {
        name: 'Lucky!',
        desc: '25 Pet Luck.'
      }, {
        name: 'Mythological Ritual',
        desc: 'Mytho mobs will rises from the ground. Chimera time!'
      }, {
        name: 'Sharing is Caring',
        desc: '3 EXP Shared Pets active at once. EXP Share rate is increased by 10%.'
      }
    ]
  },
  'Finnegan': {
    imageSrc: '/mayor/finnegan.png',
    perks: [
      {
        name: 'Blooming Business',
        desc: 'Garden Visitors gives Fine Flour and appear more often. Additional visitors may visit your Garden. Higher rarity Visitors are more likely to show up and give 10% more Copper.'
      }, {
        name: 'GOATed',
        desc: 'Jacob\'s Farming Contest: Diamond 5%, Platinum 10%, Gold 20%, Silver 40% and Bronze 70%.'
      }, {
        name: 'Pelt-pocalypse',
        desc: '1.5x more Pelts from Trevor, new Trapper Horse, more items from Trapper Shop.'
      }, {
        name: 'Pelt Eradicator',
        desc: 'Pesthunter Phillip\'s Farming Fortune now last 60 minutes. Pests are 4x more likely to spawn in sprayed plots.'
      }
    ]
  },
  'Marina': {
    imageSrc: '/mayor/marina.png',
    eventDuration: 60 * MINUTE,
    eventMessage: 'Fishing Festival',
    perks: [
      {
        name: 'Double Trouble',
        desc: 'For every 1 Sea Creature Chance, gain 0.1 Double Hook Chance.'
      }, {
        name: 'Fishing XP Buff',
        desc: '50 Fishing Wisdom on public islands.'
      }, {
        name: 'Fishing Festival',
        desc: 'Catch exclusive Sharks for 60 minutes.'
      }, {
        name: 'Luck of the Sea 2.0',
        desc: '15 Sea Creature Chance.'
      }
    ]
  },
  'Paul': {
    imageSrc: '/mayor/paul.png',
    perks: [
      {
        name: 'Bennett Arthur',
        desc: 'Blessings are 25% stronger.'
      }, {
        name: 'Marauder',
        desc: '20% cheaper Dungeon chests.'
      }, {
        name: 'EZPZ',
        desc: '10 bonus score on dungeon runs.'
      }
    ]
  },
  '??': {
    imageSrc: '/mayor/unknown2.png',
    perks: [
      {
        name: '??',
        desc: '???? ??? ????? ??? ඞ ?????'
      }
    ]
  }
}

export type MayorTime = 'past' | 'present' | 'future'