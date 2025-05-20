import {Component, OnInit, signal} from '@angular/core';
import {
  HotmTreeData,
  TreeNodeConstants,
  TreeNodeDynamics,
  initStateByType,
  Position,
  PerkType,
  getDescriptionCalculated,
  getPowderAmount
} from './hotmData';
import {Nullable} from '../../interfaces/types';
import {NgClass} from '@angular/common';
import {ColorizePipe} from '../../pipes/colorize.pipe';
import {ParseMCPipe} from '../../pipes/parse-mc.pipe';
import {SafeHtmlPipe} from '../../pipes/safe-html.pipe';

@Component({
  selector: 'sb-hotm',
  templateUrl: './hotm.component.html',
  styleUrl: './hotm.component.scss',
  imports: [
    NgClass,
    ColorizePipe,
    ParseMCPipe,
    SafeHtmlPipe
  ]
})
export class HotmComponent implements OnInit {
  grid: Nullable<TreeNodeConstants>[][] = []
  gridData = signal<Nullable<TreeNodeDynamics>[][]>([]);

  selectedPos: Nullable<Position> = null;

  ngOnInit() {
    this.initializeGrid();
  }

  private initializeGrid() {
    const initGrid: TreeNodeConstants[][] = Array.from({length: 10}, () => Array(7).fill(null));
    const initGridData: TreeNodeDynamics[][] = Array.from({length: 10}, () => Array(7).fill(null));

    for (const nodeData of Object.values(HotmTreeData)) {
      const node = nodeData.perk;
      const {x, y} = nodeData.position;

      initGrid[y][x] = {
        id: nodeData.id,
        position: {x, y},
        perk: node,
        type: nodeData.type,
      };
      initGridData[y][x] = {
        id: nodeData.id,
        data: initStateByType(nodeData.type),
      }
    }

    this.grid = initGrid;
    this.gridData.set(initGridData);
  }


  // Helpers
  protected isNotNull<T>(node: Nullable<T>): boolean {
    return node !== null;
  }

  protected getStateClass(node: Nullable<TreeNodeDynamics>) {
    return this.asTreeNodeDyn(node).data.state
  }

  protected asTreeNodeDyn(node: Nullable<TreeNodeDynamics>): TreeNodeDynamics {
    return node as TreeNodeDynamics;
  }

  protected getDescriptionByPosition(x: number, y: number): TreeNodeConstants {
    const node = this.grid[y][x];
    if (node) {
      return node;
    } else {
      throw new Error(`Node at position (${x}, ${y}) is null`);
    }
  }

  protected isLevelable(node: TreeNodeConstants): boolean {
    return !!node.perk.maxLevel;
  }

  // Click handlers

  onCellClick(x: number, y: number) {
    const node = this.gridData()[y][x];
    if (node) {
      // this.selected = node;
      this.selectedPos = {x, y};
    }
  }

  // Processors


  /*

  // Processors

  /*
  protected modifySelectedLevel_(amount: number) {
    if (!this.selected) return;

    const selected = this.selected
    const curr = selected.state.currentLevel as number;
    const max = selected.perk.maxLevel as number;

    selected.state.currentLevel = Math.min(max, Math.max(1, curr + amount));
    const {x, y} = selected.position;
    this.grid[y][x] = selected;
    // console.log(this.grid[y][x].state.currentLevel)
  }**

  modifySelectedLevel(amount: number) {
    const selected = this.sigSelected();
    if (!selected) return;

    const updatedNode = {
      ...selected,
      state: {
        ...selected.state,
        currentLevel: Math.min(
          selected.perk.maxLevel as number,
          Math.max(1, (selected.state.currentLevel || 0) + amount)
        ),
      },
    };

    this.hotmSS.updateNode(updatedNode);
  }


  */
  protected readonly PerkType = PerkType;
  protected readonly getDescriptionCalculated = getDescriptionCalculated;
  protected readonly getPowderAmount = getPowderAmount;
}
