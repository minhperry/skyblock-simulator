import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Cell } from '../../../interfaces/cell';

@Component({
  selector: 'sb-pane',
    templateUrl: './pane.component.html',
    styleUrl: './pane.component.scss'
})
export class PaneComponent<T> implements OnChanges {
  @Input() grid: Cell<T>[][] = [];
  @Output() cellClicked = new EventEmitter<{ row: number, col: number }>();

  fontSize = '16px';

  handleCellClick(row: number, col: number) {
    this.cellClicked.emit({ row, col });
  }

  ngOnChanges(change: SimpleChanges): void {
    if (change['grid']) {
      this.calculateFontSize();
    }
  }

  private calculateFontSize() {
    const totalElements = this.grid.reduce((count, row) => count + row.length, 0);

    if (totalElements > 100) {
      this.fontSize = '10px';
    } else if (totalElements > 75) {
      this.fontSize = '12px';
    } else if (totalElements > 50) {
      this.fontSize = '14px';
    } else {
      this.fontSize = '16px';
    }
  }
}
