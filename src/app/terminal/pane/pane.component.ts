import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Cell } from '../../../interfaces/cell';

@Component({
  selector: 'pane',
  templateUrl: './pane.component.html',
  styleUrl: './pane.component.scss'
})
export class PaneComponent<T> {
  @Input() grid: Cell<T>[][] = [];
  @Output() cellClicked = new EventEmitter<{ row: number, col: number }>();

  handleCellClick(row: number, col: number) {
    this.cellClicked.emit({ row, col });
  }
}
