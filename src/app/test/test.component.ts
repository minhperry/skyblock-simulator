import {Component, OnInit, signal} from '@angular/core';
import {FormsModule} from "@angular/forms";

export interface PointData {
  x: number;
  y: number;
}

type Nullable<T> = T | null;

@Component({
  selector: 'app-grid',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  imports: [
    FormsModule
  ]
})
export class TestComponent implements OnInit {
  grid = signal<Nullable<PointData>[][]>([]);
  selectedCell: Nullable<PointData> = null;
  selectedCellIndex: { row: number; col: number } | null = null;

  ngOnInit(): void {
    this.initializeGrid();
  }

  initializeGrid(): void {
    const rows = 5;
    const cols = 5;
    const newGrid = Array.from({length: rows}, () =>
      Array.from({length: cols}, () =>
        Math.random() > 0.5 ? {x: this.randomInt(), y: this.randomInt()} : null
      )
    );
    this.grid.set(newGrid);
  }

  randomInt(): number {
    return Math.floor(Math.random() * 100);
  }

  selectCell(row: number, col: number): void {
    console.log("pre:", this.selectedCell, this.selectedCellIndex);
    // Save changes to the currently selected cell before switching
    this.saveChanges();

    // Update the selected cell and its index
    const cell = this.grid()[row][col];
    this.selectedCell = cell ? {...cell} : null; // Create a copy for isolated editing
    this.selectedCellIndex = cell ? {row, col} : null;

    console.log("post:", this.selectedCell, this.selectedCellIndex);
  }

  modifyX(amount: number): void {
    if (this.selectedCell) {
      this.selectedCell.x += amount; // Modify x by the given amount
      this.saveChanges(); // Save the updated value
    }
  }

  saveChanges(): void {
    if (this.selectedCell && this.selectedCellIndex) {
      const {row, col} = this.selectedCellIndex;
      const newGrid = this.grid().map((r, i) =>
        r.map((c, j) => (i === row && j === col ? this.selectedCell : c))
      );
      this.grid.set(newGrid);
    }
  }
}
