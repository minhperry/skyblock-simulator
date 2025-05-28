import { computed, Injectable, OnDestroy } from "@angular/core";
import {
  HotmNode,
  HotmTreeData,
  PerkType,
  PowderType,
  Status,
} from "./hotmData";
import { BaseNode, LevelableNode, AbilityNode, StaticNode } from "./hotm.model";

@Injectable({
  providedIn: "root",
})
export class HotmService implements OnDestroy {
  grid: BaseNode[][] = Array.from({ length: 10 }, () => Array(7).fill(null));

  constructor() {
    for (const node of HotmTreeData) {
      const { x, y } = node.position;
      const perk = node.perk;
      switch (node.type) {
        case PerkType.DYNAMIC:
          this.grid[y][x] = new LevelableNode(
            node.id,
            perk.name,
            perk.description,
            { x, y },
            perk.perkFunc!,
            perk.powderFunc!,
            perk.maxLevel!,
            perk.requires,
          );
          break;
        case PerkType.ABILITY:
          this.grid[y][x] = new AbilityNode(
            node.id,
            perk.name,
            perk.description,
            { x, y },
            perk.requires,
          );
          break;
        case PerkType.STATIC:
          this.grid[y][x] = new StaticNode(
            node.id,
            perk.name,
            perk.description,
            { x, y },
            perk.requires,
          );
          break;
      }
    }
  }

  readonly strictAllowedTokens = 25;
  usedTokens = 0; // TODO: Replace with used tokens instead, and impl freeload mode
  freeMode = false;

  totalPowder = computed(() => {
    const total = { mithril: 0, gemstone: 0, glacite: 0 };
    for (const inner of this.grid) {
      for (const innerer of inner) {
        if (innerer instanceof LevelableNode) {
          const powder = innerer.totalPowderAmount();
          switch (innerer.powderType) {
            case PowderType.MITHRIL:
              total.mithril += powder;
              break;
            case PowderType.GEMSTONE:
              total.gemstone += powder;
              break;
            case PowderType.GLACITE:
              total.glacite += powder;
              break;
          }
        }
      }
    }
    return total;
  });

  getOpenIds(): HotmNode[] {
    return this.grid
      .flatMap((inner) => inner.map((innerer) => innerer)) // Flatten
      .filter((node) => node !== null) // Filter nulls
      .filter((node) => node.status() !== Status.LOCKED) // Filter locked nodes
      .map((node) => node.id); // Map to ids
  }

  ngOnDestroy() {
    // Clear the grid if needed
    this.grid = [];
  }
}
