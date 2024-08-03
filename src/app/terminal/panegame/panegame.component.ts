import { Component, OnDestroy, OnInit } from '@angular/core';
import { Cell, CellState } from '../../../interfaces/cell';
import { GameConfig } from '../../../interfaces/game-config';
import { TimerService } from '../../../services/timer.service';

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
  min = 1;
  max = 7;

  constructor(public timer: TimerService) {
  }

  ngOnInit(): void {
      this.initializeGrid()
  }

  ngOnDestroy(): void {
      this.timer.stop()
  }

  private genRandom(min: number, max: number): void {
    let onCellsRemaining =  Math.floor(Math.random() * (max + 1)) + min;

    while (onCellsRemaining > 0) {
      const row = Math.floor(Math.random() * this.config.height);
      const col = Math.floor(Math.random() * this.config.width);

      if (this.config.grid[row][col].state === CellState.OFF) {
        this.config.grid[row][col].state = CellState.ON;
        onCellsRemaining--;
      }
    }
  }

  initializeGrid() {
    this.config.grid = Array.from({ length: this.config.height }, () => 
      Array.from({ length: this.config.width }, () => ({ state: CellState.OFF }))
    );
    this.genRandom(this.min, this.max); 
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

  private checkAllOn(): boolean { 
    return this.config.grid.every(row => row.every(cell => cell.state === CellState.ON));
  }
}
