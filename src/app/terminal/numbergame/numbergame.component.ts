import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
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
  
  private size(): number { return this.config.width * this.config.height; }

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
    const size = this.size();
    const numbers = Array.from({ length: size }, (_, i) => i + 1);

    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    let grid$: Cell<number>[][] = [];
    for (let i = 0; i < size; i++) {
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

  initializeGrid(genNew: boolean = true) {
    this.config.grid = genNew ? this.genGrid() : this.config.grid;

    if (this.next > this.size()) return
    if (this.next - 1 > this.size()) return

    const {row, col} = this.num2GridMap.get(this.next)!;    
    const {row: orow, col: ocol} = this.num2GridMap.get(this.next + 1)!;

    if (this.stupid) {
      this.config.grid[row][col].state = CellState.NEXT;
      this.config.grid[orow][ocol].state = CellState.OVERNEXT;
    } else {
      this.config.grid[row][col].state = CellState.OFF;
      this.config.grid[orow][ocol].state = CellState.OFF;
    }
  }

  private existAll(numArr: number[]): boolean {
    return numArr.every(num => num != undefined);
  }

  onCellClicked(cell: { row: number, col: number }) {
    const size = this.size();
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

      if (this.stupid && this.next <= size) {
        const nxt = this.num2GridMap.get(this.next);
        if (nxt) {
          this.config.grid[nxt.row][nxt.col].state = CellState.NEXT;
        }

        const ovnxt = this.num2GridMap.get(this.next + 1);
        if (ovnxt && this.next + 1 <= size) {
          this.config.grid[ovnxt.row][ovnxt.col].state = CellState.OVERNEXT;
        }
      }

      if (this.next > size) {
        this.timer.stop();
      }
    }
  }

  toggleStupidity() {
    this.stupid = !this.stupid;
    this.initializeGrid(false);
  }

  onRestartButtonClick() {
    this.timer.restart()
    this.config.started = false;
    this.initializeGrid(true);
    this.next = 1;
  }
}
