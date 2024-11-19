import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameConfig } from '../../../interfaces/game-config';
import { Cell, next, random } from '../../../interfaces/cell';
import { TimerService } from '../../../services/timer.service';

@Component({
    selector: 'colorgame',
    templateUrl: './colorer.component.html',
    styleUrl: './colorer.component.scss',
    providers: [
        { provide: 'timeInMs', useValue: 100 },
        TimerService
    ],
    standalone: false
})
export class ColorerComponent implements OnInit, OnDestroy {
  edgeSize = 3;
  config: GameConfig<null> = this.configure();

  constructor(public timer: TimerService) {
  }

  private configure() {
    return {
      grid: [],
      started: false,
      width: this.edgeSize,
      height: this.edgeSize
    }
  }

  ngOnInit(): void {
    this.initGrid();
  }

  ngOnDestroy(): void {
    this.timer.stop();
  }

  onRestart(): void {
    this.timer.restart();
    this.config.started = false;
    this.initGrid();
  }

  onCellClick(cell: {row: number, col: number}): void {
    if (!this.config.started) {
      this.config.started = true;
      this.timer.start();
    }

    this.config.grid[cell.row][cell.col].state = next(this.config.grid[cell.row][cell.col].state);

    if (this.isAllSameColor()) {
      this.timer.stop();
    }
  }

  private generateGrid(): Cell<null>[][] {
    let grid$: Cell<null>[][] = [];

    for (let i = 0; i < this.config.height; i++) {
      grid$[i] = [];
      for (let j = 0; j < this.config.width; j++) {
        grid$[i][j] = { state: random() };
      }
    }
    return grid$;
  }

  initGrid(): void {
    this.config = this.configure();
    this.config.grid = this.generateGrid();
  }

  private isAllSameColor(): boolean {
    const unique = new Set();
    this.config.grid.forEach(row => row.forEach(cell => unique.add(cell.state)));
    return unique.size === 1;
  }

  onEdgeSizeChange(event: Event): void {
    this.edgeSize = parseInt((event.target as HTMLInputElement).value);
    this.onRestart();
  }
}
