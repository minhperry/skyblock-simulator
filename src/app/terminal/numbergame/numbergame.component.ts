import { Component, OnInit, OnDestroy } from '@angular/core';
import { Cell, CellState } from '../../../interfaces/cell';
import { ChangeDetectorRef } from '@angular/core';
import { GameConfig } from '../../../interfaces/game-config';
import { TimerService } from '../../../services/timer.service';

@Component({
  selector: 'numbergame',
  templateUrl: './numbergame.component.html',
  styleUrl: './numbergame.component.scss',
  providers: [
    {provide: 'timeInMs', useValue: 100},
    TimerService
  ]
})
export class NumbergameComponent implements OnInit, OnDestroy {
  config: GameConfig<number> = {
    grid: [],
    started: false,
    width: 7,
    height: 2
  }
  next: number = 1;
  stupid: boolean = false;
  size: number = this.config.width * this.config.height;

  grid2NumMap: Map<{ row: number, col: number }, number> = new Map();
  num2GridMap: Map<number, { row: number, col: number }> = new Map();

  constructor(private cd: ChangeDetectorRef, public timer: TimerService) {
  }

  ngOnInit(): void {
      this.initializeGrid()
  }

  ngOnDestroy(): void {
      this.timer.stop()
  }

  private genGrid(): Cell<number>[][] {
    const numbers = Array.from({ length: this.size }, (_, i) => i + 1);

    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    let grid$: Cell<number>[][] = [];
    for (let i = 0; i < this.size; i++) {
      const row = Math.floor(i / this.config.width);
      const col = i % this.config.width;
      if (col === 0) {
        grid$.push([]);
      }
      grid$[row].push({ value: numbers[i], state: CellState.OFF });
      this.grid2NumMap.set({ row, col }, numbers[i]);
      this.num2GridMap.set(numbers[i], { row, col });
    }
    return grid$;
  }

  initializeGrid() {
    this.config.grid = this.genGrid();
    if (this.stupid) {
      const {row, col} = this.num2GridMap.get(1)!;
      this.config.grid[row][col].state = CellState.NEXT;
    }
  }

  onCellClicked(cell: { row: number, col: number }) {
    const { row, col } = cell;
    const clickedNumber = this.config.grid[row][col].value;

    if (!this.config.started) {
      if (clickedNumber !== 1) {
        return;
      } else {
        this.config.started = true;
        this.timer.start();
      }
    }

    if (clickedNumber === this.next) {
      this.config.grid[row][col].state = CellState.ON;
      this.next++;

      if (this.stupid && this.next <= this.size) {
        const nxt = this.num2GridMap.get(this.next);
        if (nxt) {
          this.config.grid[nxt.row][nxt.col].state = CellState.NEXT;
        }
      }

      if (this.next > this.size) {
        this.timer.stop();
      }
    }
  }

  toggleStupidity() {
    this.stupid = !this.stupid;
    this.reRender();
  }

  onRestartButtonClick() {
    this.timer.restart()
    this.config.started = false;
    this.initializeGrid();
    this.next = 1;
    this.reRender();
  }

  reRender() {
    this.config.grid = [...this.config.grid];
    this.cd.detectChanges();
  }
}
