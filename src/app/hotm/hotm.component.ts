import {Component, inject, signal, WritableSignal} from '@angular/core';
import {Position} from './hotmData';
import {Nullable} from '../../interfaces/types';
import {NgClass} from '@angular/common';
import {HotmService} from './hotm.service';
import {CardComponent} from './card.component';

@Component({
  selector: 'sb-hotm',
  templateUrl: './hotm.component.html',
  styleUrl: './hotm.component.scss',
  imports: [
    NgClass,
    CardComponent
  ]
})
export class HotmComponent {
  hotmServ = inject(HotmService);
  selectedPos: WritableSignal<Nullable<Position>> = signal(null)

  // Click handlers

  onCellClick(x: number, y: number) {
    this.selectedPos.set({x, y});
  }
}
