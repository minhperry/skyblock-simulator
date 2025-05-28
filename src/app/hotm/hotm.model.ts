import { WritableSignal, Signal, signal, computed, effect } from '@angular/core';
import { PerkFunction, PowderFunction } from '../../interfaces/functions';
import { HotmNode, Position, Status, PowderType } from './hotmData';

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

  abstract onNodeOpened(): void;
}
export class StaticNode extends BaseNode {
  readonly type = 'static';

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
    }); // Coal = locked, Diamond = unlocked
  }

  override onNodeOpened(): void {
    this.status.set(Status.MAXED);
  }
}
export class AbilityNode extends BaseNode {
  readonly type = 'ability';

  constructor(
    id: HotmNode,
    name: string,
    description: string,
    position: Position,
    reqs: HotmNode[]
  ) {
    // Open Core by default
    if (id === HotmNode.SPECIAL_0) super(id, name, description, position, signal(Status.UNLOCKED), reqs);
    else super(id, name, description, position, signal(Status.LOCKED), reqs);
  }

  override cssClass(): Signal<string> {
    return computed(() => {
      return this.status() === Status.LOCKED
        ? 'coalblock'
        : (this.position.x === 3 && this.position.y === 5
          ? 'redstoneblock'
          : 'emeraldblock'
        );
    });
  }

  override onNodeOpened() {
    this.status.set(Status.UNLOCKED);
  }
}
export class LevelableNode extends BaseNode {
  readonly type = 'levelable';

  private readonly perkFunction: PerkFunction = (() => ({ first: 0, second: 0 }));
  private readonly powderFunction: PowderFunction = (() => 0);
  currentLevel: WritableSignal<number> = signal(1);
  readonly maxLevel: number;
  readonly powderType: PowderType;

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

    const y = position.y;
    this.powderType = y >= 7 && y <= 9 ? PowderType.MITHRIL : y >= 3 && y <= 6 ? PowderType.GEMSTONE : PowderType.GLACITE;

    // Change icon on level change
    effect(() => {
      const curr = this.currentLevel();
      if (curr >= this.maxLevel) {
        this.status.set(Status.MAXED);
      } else if (curr > 1 && curr < this.maxLevel) {
        this.status.set(Status.PROGRESSING);
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
    });
  }

  override onNodeOpened(): void {
    this.status.set(Status.PROGRESSING);
  }

  readonly powderAmount = computed(() => {
    const curr = this.currentLevel();
    return this.powderFunction(curr);
  });

  readonly totalPowderAmount = computed(() => {
    const curr = this.currentLevel();
    let total = 0;
    for (let i = 2; i <= curr; i++) {
      total += this.powderFunction(i);
    }
    return total;
  });

  readonly formattedDescription = computed(() => {
    const curr = this.currentLevel();
    const numTup = this.perkFunction(curr);

    const num1 = LevelableNode.formatNumberLocale(numTup.first);
    const num2 = LevelableNode.formatNumberLocale(numTup.second);
    return this.description.replace('#{1}', num1).replace('#{2}', num2);
  });

  private static formatNumberLocale(num: number): string {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }
}

export function castToLevelable(base: BaseNode) {
    return base as LevelableNode;
}