import {Component, inject} from '@angular/core';
import {
  TreeNodeConstants,
  TreeNodeDynamics,
  PerkType,
  getPowderAmount
} from './hotmData';
import {Nullable} from '../../interfaces/types';
import {NgClass} from '@angular/common';
import {ColorizePipe} from '../../pipes/colorize.pipe';
import {ParseMCPipe} from '../../pipes/parse-mc.pipe';
import {SafeHtmlPipe} from '../../pipes/safe-html.pipe';
import {HotmService} from './hotm.service';

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
export class HotmComponent {
  hotmServ = inject(HotmService);

  // Helpers
  protected isNotNull<T>(node: Nullable<T>): boolean {
    return node !== null;
  }

  protected getStateClass(node: Nullable<TreeNodeDynamics>) {
    return (node as TreeNodeDynamics).data.state
  }

  protected isLevelable(node: TreeNodeConstants): boolean {
    return !!node.perk.maxLevel;
  }

  // Click handlers

  onCellClick(x: number, y: number) {
    const node = this.hotmServ.gridData[y][x];
    if (node) {
      // this.selected = node;
      this.hotmServ.selectedPos.set({x, y});
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
}
