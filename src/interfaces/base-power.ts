export interface BasePower {
    strength?: number;
    def?: number;
    speed?: number;
    health?: number;
    critChance?: number;
    critDmg?: number;
    int?: number;
    atkSpd?: number;
    trueDef?: number;
    mending?: number;
    vitality?: number;
}

export interface PowerStone {
    id: string;
    name: string;
    basePower: BasePower;
    bonus?: BasePower
}

export enum Color {
    RED = '#f55',
    GREEN = '#5f5',
    WHITE = '#fff',
    BLUE = '#55f',
    YELLOW = '#ff5',
    AQUA = '#5ff',
    DARK_RED = '#a00'
}

export const Stats: PowerStone[] = [
    {
        id: 'fortituous', name: 'Fortituous', basePower: {
            strength: 20, def: 5, health: 10, critChance: 45, critDmg: 20
        }
    },
    {
        id: 'pretty', name: 'Pretty', basePower: {
            strength: 20, def: 5, speed: 5, health: 5, critChance: 15, critDmg: 20, int: 30
        }
    },
    {
        id: 'protected', name: 'Protected', basePower: {
            strength: 10, def: 45, health: 35, critChance: 5, critDmg: 5
        }
    },
    {
        id: 'simple', name: 'Simple', basePower: {
            strength: 15, def: 15, speed: 10, health: 15, critChance: 15, critDmg: 15, int: 15
        }
    },
    {
        id: 'warrior', name: 'Warrior', basePower: {
            strength: 35, def: 5, health: 10, critChance: 25, critDmg: 25
        }
    },
    {
        id: 'commando', name: 'Commando', basePower: {
            strength: 35, def: 10, health: 15, critChance: 5, critDmg: 35
        }
    },
    {
        id: 'disciplined', name: 'Disciplined', basePower: {
            strength: 30, def: 10, health: 15, critChance: 15, critDmg: 30
        }
    },
    {
        id: 'inspired', name: 'Inspired', basePower: {
            strength: 20, def: 5, health: 5, critChance: 10, critDmg: 15, int: 45
        }
    },
    {
        id: 'omnious', name: 'Omnious', basePower: {
            strength: 15, speed: 8, health: 15, critChance: 15, critDmg: 15, int: 12, atkSpd: 20
        }
    },
    {
        id: 'prepared', name: 'Prepared', basePower: {
            strength: 8, def: 47, health: 37, critChance: 4, critDmg: 4
        }
    },
    {
        id: 'silky', name: 'Silky', basePower: {
            speed: 5, critDmg: 95
        }, bonus: {
            atkSpd: 5
        }
    },
    {
        id: 'sweet', name: 'Sweet', basePower: {
            def: 45, speed: 10, health: 45
        }, bonus: {
            speed: 5
        }
    },
    {
        id: 'adept', name: 'Adept', basePower: {
            def: 40, health: 50, int: 10
        }, bonus: {
            health: 100, def: 50
        }
    },
    {
        id: 'bloody', name: 'Bloody', basePower: {
            strength: 45, critDmg: 45, int: 10
        }, bonus: {
            atkSpd: 10
        }
    },
    {
        id: 'forceful', name: 'Forceful', basePower: {
            strength: 75, health: 5, critDmg: 20
        }
    },
    {
        id: 'itchy', name: 'Itchy', basePower: {
            strength: 30, speed: 5, critDmg: 35, atkSpd: 30
        }, bonus: {
            strength: 15, critDmg: 15
        }
    },
    {
        id: 'mythical', name: 'Mythical', basePower: {
            strength: 17, def: 17, speed: 8, health: 17, critChance: 17, critDmg: 17, int: 17
        }, bonus: {
            strength: 40, health: 150
        }
    },
    {
        id: 'shaded', name: 'Shaded', basePower: {
            strength: 20, speed: 5, critDmg: 75
        }, bonus: {
            atkSpd: 3
        }
    },
    {
        id: 'sighted', name: 'Sighted', basePower: {
            int: 100
        }
    },
    {
        id: 'bizzare', name: 'Bizzare', basePower: {
            strength: -10, critDmg: -10, int: 120
        }
    },
    {
        id: 'demonic', name: 'Demonic', basePower: {
            strength: 23, int: 77
        }, bonus: {
            critDmg: 50
        }
    },
    {
        id: 'hurtful', name: 'Hurtful', basePower: {
            strength: 20, critDmg: 80
        }, bonus: {
            atkSpd: 15
        }
    },
    {
        id: 'pleasant', name: 'Pleasant', basePower: {
            def: 60, health: 40
        }
    },
    {
        id: 'sanguisuge', name: 'Sanguisuge', basePower: {
            strength: 50, health: 15, critDmg: 20, mending: 15
        }, bonus: {
            int: 100
        }
    },
    {
        id: 'frozen', name: 'Frozen', basePower: {
            def: 50
        }, bonus: {
            trueDef: 10
        }
    },
    {
        id: 'healthy', name: 'Healthy', basePower: {
            health: 100
        }, bonus: {
            health: 200
        }
    },
    {
        id: 'slender', name: 'Slender', basePower: {
            strength: 25, def: 25, speed: 5, health: 25, critDmg: 25, int: 25, atkSpd: 15
        }, bonus: {
            health: 100, strength: 50
        }
    },
    {
        id: 'strong', name: 'Strong', basePower: {
            strength: 50, critDmg: 50
        }, bonus: {
            strength: 25, critDmg: 25
        }
    },
    {
        id: 'bubba', name: 'Bubba', basePower: {
            strength: 25, def: -40, health: 15, critChance: 10, critDmg: 45, atkSpd: 25, trueDef: 20
        }
    },
    {
        id: 'crumbly', name: 'Crumbly', basePower: {
            health: 30, int: 15, trueDef: 10, mending: 30, vitality: 30
        }, bonus: {
            speed: 25
        }
    },
    {
        id: 'scorching', name: 'Scorching', basePower: {
            strength: 35, critDmg: 40, atkSpd: 25
        }
    }
]

export const StatsMultiplier = {
    int: 1.5, health: 1.4, strength: 1, def: 1, critDmg: 1, speed: 0.5,
    critChance: 0.4, vitality: 0.333, atkSpd: 0.3, trueDef: 0.27, mending: 0.25
}
