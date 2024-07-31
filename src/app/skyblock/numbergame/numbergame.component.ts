import { Component, OnInit, OnDestroy } from '@angular/core';
import { Cell, CellState } from '../../../interfaces/cell';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'numbergame',
  templateUrl: './numbergame.component.html',
  styleUrl: './numbergame.component.css'
})
export class NumbergameComponent implements OnInit, OnDestroy {
  grid: Cell[][] = [];
  timer: number = 0;
  intervalId: any;
  started: boolean = false;
  stupid: boolean = false;
  next: number = 1;

  width = 7;
  height = 2;
  size = this.width * this.height;
  grid2NumMap: Map<{ row: number, col: number }, number> = new Map();
  num2GridMap: Map<number, { row: number, col: number }> = new Map();

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
      this.initializeGrid()
  }

  ngOnDestroy(): void {
      this.stopTimer()
  }

  private genGrid(): Cell[][] {
    const numbers = Array.from({ length: this.size }, (_, i) => i + 1);

    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    let grid$: Cell[][] = [];
    for (let i = 0; i < this.size; i++) {
      const row = Math.floor(i / this.width);
      const col = i % this.width;
      if (col === 0) {
        grid$.push([]);
      }
      grid$[row].push({ number: numbers[i], state: CellState.OFF });
      this.grid2NumMap.set({ row, col }, numbers[i]);
      this.num2GridMap.set(numbers[i], { row, col });
    }
    return grid$;
  }

  initializeGrid() {
    this.grid = this.genGrid();
    if (this.stupid) {
      const {row, col} = this.num2GridMap.get(1)!;
      this.grid[row][col].state = CellState.NEXT;
    }
  }

  startTimer() {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.timer += 0.1;
      }, 100);
    }
  }

  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  onCellClicked(cell: { row: number, col: number }) {
    if (!this.started) {
      this.started = true;
      this.startTimer();
    }

    const { row, col } = cell;
    const clickedNumber = this.grid[row][col].number;

    if (clickedNumber === this.next) {
      this.grid[row][col].state = CellState.ON;
      this.next++;

      if (this.stupid && this.next <= this.size) {
        const nxt = this.num2GridMap.get(this.next);
        if (nxt) {
          this.grid[nxt.row][nxt.col].state = CellState.NEXT;
        }
      }

      if (this.next > this.size) {
        this.stopTimer();
      }
    }
  }

  toggleStupidity() {
    this.stupid = !this.stupid;
    this.reRender();
  }

  onRestartButtonClick() {
    this.stopTimer();
    this.timer = 0;
    this.started = false;
    this.initializeGrid();
    this.next = 1;
    this.reRender();
  }

  reRender() {
    this.grid = [...this.grid];
    this.cd.detectChanges();
  }
}
