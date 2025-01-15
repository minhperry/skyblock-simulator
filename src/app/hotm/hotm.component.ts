import {Component, computed, Inject, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {AbilityState, InitialHotmTree, PerkState, Powder, TreeNode} from "../../interfaces/hotmData";
import {NgClass} from "@angular/common";
import {Nullable} from "../../interfaces/types";
import {SafeHtmlPipe} from "../../pipes/safe-html.pipe";
import {PerkFunction, PowderFunction, round} from "../../interfaces/functions";
import {PowderString} from "../../interfaces/symbols";
import {ColorizePipe} from "../../pipes/colorize.pipe";
import {ParseMCPipe} from "../../pipes/parse-mc.pipe";

@Component({
  selector: 'app-hotm',
  templateUrl: './hotm.component.html',
  styleUrl: './hotm.component.scss',
  imports: [
    NgClass,
    SafeHtmlPipe,
    ColorizePipe,
    ParseMCPipe
  ]
})
export class HotmComponent implements OnInit {
  grid = signal<Nullable<TreeNode>[][]>([])
  selected: Nullable<TreeNode> = null;
  selectedIndex: { row: number; col: number } | null = null;

  totalPowder = computed<Powder>(() => {
    let powder: Powder = {mithril: 0, gemstone: 0, glacite: 0};
    this.grid().forEach(row => {
      row.forEach(node => {
        if (!node || !node.state.currentLevel || !node.perk.powderFunc) {
          return; // Skip null nodes or nodes without necessary data.
        }
        if (node.state.state === PerkState.LOCKED) {
          return; // Skip locked nodes
        }

        const {y} = node.position;
        const perkValue = node.perk.powderFunc(node.state.currentLevel);

        if (y >= 7 && y <= 9) {
          powder.mithril += perkValue;
        } else if (y >= 3 && y <= 6) {
          powder.gemstone += perkValue;
        } else if (y >= 0 && y <= 2) {
          powder.glacite += perkValue;
        }
      });
    });
    return powder;
  });

  DEBUG = true

  constructor(
    // private hotm: HotmBackendService
    @Inject(PLATFORM_ID) private platform: Object,
  ) {
  }

  ngOnInit() {
    this.initializeGrid()
  }

  private initializeGrid() {
    const initGrid = Array.from({length: 10}, () => Array(7).fill(null));

    for (const nodeData of Object.values(InitialHotmTree)) {
      const node = nodeData.perk
      const {x, y} = nodeData.position

      initGrid[y][x] = {
        id: nodeData.id,
        position: {x, y},
        perk: node,
        state: nodeData.state,
      }
    }

    this.grid.set(initGrid)
  }

  onCellClick(x: number, y: number) {
    const cell = this.grid()[x][y];
    if (cell) {
      this.selected = {
        ...cell,
        state: {...cell.state}, // Create a new copy of the state to avoid direct mutation
      };
    } else {
      this.selected = null;
    }

    // FUCK YOU DEEP COPY
    // this.selected = cell ? {...cell} : null;
    this.selectedIndex = cell ? {row: x, col: y} : null;
    this.save()
  }

  save() {
    if (this.selected && this.selectedIndex) {
      const {row: currentRow, col: currentCol} = this.selectedIndex;
      const newGrid = this.grid().map((r, i) =>
        r.map((c, j) => (i === currentRow && j === currentCol ? this.selected : c))
      );
      this.grid.set(newGrid);
    }
  }

  unlock() {
    if (this.selected) {
      const state = this.selected.state.state
      console.log(state)
      if (state in PerkState) {
        this.selected.state.state = PerkState.PROGRESSING
      } else if (state in AbilityState) {
        this.selected.state.state = AbilityState.UNLOCKED
      }
    }
  }
  // Helpers

  protected getStateClass(node: Nullable<TreeNode>) {
    return this.asTreeNode(node).state.state
  }

  protected asTreeNode(node: Nullable<TreeNode>): TreeNode {
    return node as TreeNode;
  }

  protected isNotNull(node: Nullable<TreeNode>): boolean {
    return node !== null
  }

  protected isLevelable(node: Nullable<TreeNode>): boolean {
    return !!node?.perk.maxLevel;
  }

  protected isAbility(node: Nullable<TreeNode>): boolean {
    return node ? this.stateIsAbility(node.state.state) : false;
  }

  private stateIsAbility(state: AbilityState | PerkState): boolean {
    return Object.values(AbilityState).includes(state as AbilityState)
  }

  // Processors

  protected modifySelectedLevel(amount: number | 'max') {
    if (this.selected) {
      if (amount === 'max') {
        this.selected.state.currentLevel = this.selected.perk.maxLevel as number;
      } else {
        const curr = this.selected.state.currentLevel as number;
        const max = this.selected.perk.maxLevel as number;

        this.selected.state.currentLevel = Math.min(max, Math.max(1, curr + amount));
      }
      this.save()
    }
  }

  protected getDescCalculated(node: Nullable<TreeNode>) {
    const asTN = this.asTreeNode(node)
    const curr = asTN.state.currentLevel as number;
    const desc = new ColorizePipe().transform(asTN.perk.description);

    const func = asTN.perk.perkFunc as PerkFunction
    const c1 = round(func(curr).first).toString();
    const c2 = round(func(curr).second).toString();
    return desc.replace('#{1}', c1).replace('#{2}', c2);
  }

  protected getPowderAmount(node: Nullable<TreeNode>): string {
    const asTN = this.asTreeNode(node)

    const curr = asTN.state.currentLevel as number;
    const powderFunc = asTN.perk.powderFunc as PowderFunction

    const y = asTN.position.y
    let pType: PowderString;
    if (y >= 7 && y <= 9) {
      pType = PowderString.MITHRIL;
    } else if (y >= 3 && y <= 6) {
      pType = PowderString.GEMSTONE;
    } else {
      pType = PowderString.GLACITE;
    }

    const amountFormatted = powderFunc(curr).toLocaleString('en-US');
    return pType.replace('#{#}', amountFormatted);
  }
}
