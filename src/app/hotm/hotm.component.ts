import {Component, inject, signal, WritableSignal} from '@angular/core';
import {Position} from './hotmData';
import {Nullable} from '../../interfaces/types';
import {NgClass} from '@angular/common';
import {HotmService} from './hotm.service';
import {StaticComponent} from './static.component';

@Component({
  selector: 'sb-hotm',
  templateUrl: './hotm.component.html',
  styleUrl: './hotm.component.scss',
  imports: [
    NgClass,
    StaticComponent
  ]
})
export class HotmComponent {
  hotmServ = inject(HotmService);
  selectedPos: WritableSignal<Nullable<Position>> = signal(null)

  // Click handlers

  onCellClick(x: number, y: number) {
    this.selectedPos.set({x, y});
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
  }*/
}
