import {computed, effect, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {HotmNode, HotmTreeData, PerkType, Position, Status} from './hotmData';
import {PerkFunction, PowderFunction} from '../../interfaces/functions';
import {PowderString} from './symbols';

@Injectable({
  providedIn: 'root'
})
export class HotmService {
  grid: BaseNode[][] = Array.from({length: 10}, () => Array(7).fill(null));

  constructor() {
    for (const node of HotmTreeData) {
      const {x, y} = node.position
      const perk = node.perk
      switch (node.type) {
        case PerkType.DYNAMIC:
          this.grid[y][x] = new LevelableNode(
            node.id,
            perk.name,
            perk.description,
            {x, y},
            perk.perkFunc!,
            perk.powderFunc!,
            perk.maxLevel!,
            perk.requires
          )
          break;
        case PerkType.ABILITY:
          this.grid[y][x] = new AbilityNode(
            node.id,
            perk.name,
            perk.description,
            {x, y},
            perk.requires
          )
          break;
        case PerkType.STATIC:
          this.grid[y][x] = new StaticNode(
            node.id,
            perk.name,
            perk.description,
            {x, y},
            perk.requires
          )
          break;
      }
    }
  }

  getOpenIds(): HotmNode[] {
    return this.grid
      .flatMap(inner => inner.map(innerer => innerer)) // Flatten
      .filter(node => node !== null) // Filter nulls
      .filter(node => node.status() !== Status.LOCKED) // Filter locked nodes
      .map(node => node.id) // Map to ids
  }
}

export function castToLevelable(base: BaseNode) {
  return base as LevelableNode
}

export abstract class BaseNode {
  protected constructor(
    public id: HotmNode,
    public name: string,
    public description: string, // can be template description
    public position: Position,
    public status: WritableSignal<Status>,
    public requires: HotmNode[]
  ) {
  }

  abstract readonly type: 'ability' | 'levelable' | 'static';

  abstract cssClass(): Signal<string>;

  abstract onNodeOpened(): void
}

class StaticNode extends BaseNode {
  readonly type = 'static'

  constructor(
    id: HotmNode,
    name: string,
    description: string,
    position: Position,
    reqs: HotmNode[]
  ) {
    super(id, name, description, position, signal(Status.LOCKED), reqs);
  }

  override cssClass(): Signal<string> {
    return computed(() => {
      return this.status() === Status.LOCKED ? 'coal' : 'diamond';
    }) // Coal = locked, Diamond = unlocked
  }

  override onNodeOpened(): void {
    this.status.set(Status.MAXED)
  }
}

class AbilityNode extends BaseNode {
  readonly type = 'ability'

  constructor(
    id: HotmNode,
    name: string,
    description: string,
    position: Position,
    reqs: HotmNode[]
  ) {
    super(id, name, description, position, signal(Status.LOCKED), reqs);
  }

  override cssClass(): Signal<string> {
    return computed(() => {
      return this.status() === Status.LOCKED
        ? 'coalblock'
        : (this.position.x === 3 && this.position.y === 5
            ? 'redstoneblock'
            : 'emeraldblock'
        );
    })
  }

  override onNodeOpened() {
    this.status.set(Status.UNLOCKED)
  }
}

class LevelableNode extends BaseNode {
  readonly type = 'levelable'

  private readonly perkFunction: PerkFunction = (() => ({first: 0, second: 0}))
  private readonly powderFunction: PowderFunction = (() => 0)
  currentLevel: WritableSignal<number> = signal(1)
  readonly maxLevel: number;

  constructor(
    id: HotmNode,
    name: string,
    description: string,
    position: Position,
    perkFunction: PerkFunction,
    powderFunction: PowderFunction,
    maxLevel: number,
    reqs: HotmNode[]
  ) {
    super(id, name, description, position, signal(Status.LOCKED), reqs);
    this.perkFunction = perkFunction;
    this.powderFunction = powderFunction;
    this.maxLevel = maxLevel;

    // Change icon on level change
    effect(() => {
      const curr = this.currentLevel()
      if (curr >= this.maxLevel) {
        this.status.set(Status.MAXED)
      } else if (curr > 1 && curr < this.maxLevel) {
        this.status.set(Status.PROGRESSING)
      }
    });
  }

  override cssClass(): Signal<string> {
    return computed(() => {
      switch (this.status()) {
        case Status.LOCKED:
          return 'coal';
        case Status.PROGRESSING:
          return 'emerald';
        case Status.MAXED:
          return 'diamond';
        default:
          return '';
      }
    })
  }

  override onNodeOpened(): void {
    this.status.set(Status.PROGRESSING)
  }

  readonly powderAmount = computed(() => {
    const curr = this.currentLevel()
    return this.powderFunction(curr)
  });

  readonly totalPowderAmount = computed(() => {
    const curr = this.currentLevel()
    let total = 0
    for (let i = 2; i <= curr; i++) {
      total += this.powderFunction(i)
    }
    return total
  })

  readonly formattedDescription = computed(() => {
    const curr = this.currentLevel()
    const numTup = this.perkFunction(curr)

    const num1 = LevelableNode.formatNumberLocale(numTup.first)
    const num2 = LevelableNode.formatNumberLocale(numTup.second)
    return this.description.replace('#{1}', num1).replace('#{2}', num2);
  })

  private static formatNumberLocale(num: number): string {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }
}