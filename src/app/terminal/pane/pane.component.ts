import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Cell } from '../../../interfaces/cell';

@Component({
  selector: 'pane',
  templateUrl: './pane.component.html',
  styleUrl: './pane.component.css'
})
export class PaneComponent {
  @Input() grid: Cell<number>[][] = [];
  @Output() cellClicked = new EventEmitter<{ row: number, col: number }>();

  handleCellClick(row: number, col: number) {
    this.cellClicked.emit({ row, col });
  }
}
