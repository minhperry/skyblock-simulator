import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { Cell, CellState } from '../../../interfaces/cell';
import { GameConfig } from '../../../interfaces/game-config';
import { TimerService } from '../../../services/timer.service';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'panegame',
  templateUrl: './panegame.component.html',
  styleUrl: './panegame.component.scss',
  providers: [
    {provide: 'timeInMs', useValue: 100},
    TimerService
  ]
})
export class PaneGameComponent implements OnInit, OnDestroy {
  config: GameConfig<null> = {
    grid: [],
    started: false,
    width: 7,
    height: 3
  };
  minPercent = 0.05;
  maxPercent = 0.35;

  constructor(public timer: TimerService) {
  }

  ngOnInit(): void {
      this.initializeGrid()
  }

  ngOnDestroy(): void {
      this.timer.stop()
  }

  private getRandomAmount(minP: number, maxP: number): number {
    const gridSize = this.config.width * this.config.height;
    const minCells = Math.floor(gridSize * minP);
    const maxCells = Math.floor(gridSize * maxP);
    return Math.floor(Math.random() * (maxCells - minCells + 1)) + minCells;
  }

  private genRandom(minP: number, maxP: number): void {
    let remains = this.getRandomAmount(minP, maxP);


    while (remains > 0) {
      const row = Math.floor(Math.random() * this.config.height);
      const col = Math.floor(Math.random() * this.config.width);

      if (this.config.grid[row][col].state === CellState.OFF) {
        this.config.grid[row][col].state = CellState.ON;
        remains--;
      }
    }
  }

  initializeGrid() {
    this.config.grid = Array.from({length: this.config.height}, () =>
      Array.from({ length: this.config.width }, () => ({ state: CellState.OFF }))
    );
    this.genRandom(this.minPercent, this.maxPercent);
  }

  onRestartButtonClick() {
    this.timer.restart();
    this.config.started = false;
    this.initializeGrid();
  }

  onCellClicked(cell: { row: number, col: number }) {
    if (!this.config.started) {
      this.config.started = true;
      this.timer.start();
    }

    const { row, col } = cell;
    this.config.grid[row][col].state =
      this.config.grid[row][col].state === CellState.OFF ?
       CellState.ON : CellState.ON;

    if (this.checkAllOn()) {
      this.timer.stop();
    }
  }

  onSliderChange(event: Event, which: 'w' | 'h') {
    if (which === 'w') {
      this.config.width = parseInt((event.target as HTMLInputElement).value);
    } else {
      this.config.height = parseInt((event.target as HTMLInputElement).value);
    }
    this.onRestartButtonClick()
  }

  private checkAllOn(): boolean {
    return this.config.grid.every(row => row.every(cell => cell.state === CellState.ON));
  }
}
