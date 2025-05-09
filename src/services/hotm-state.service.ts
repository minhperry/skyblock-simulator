import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Nullable} from "../interfaces/types";
import {TreeNode} from "../interfaces/hotmData";

@Injectable({
  providedIn: 'root'
})
export class HotmStateService {
  private gridSubj = new BehaviorSubject<Nullable<TreeNode>[][]>([])
  private selectedSubj = new BehaviorSubject<Nullable<TreeNode>>(null)

  grid$ = this.gridSubj.asObservable()
  selected$ = this.selectedSubj.asObservable()

  initializeGrid(grid: Nullable<TreeNode>[][]) {
    this.gridSubj.next(grid)
  }

  selectNode(x: number, y: number) {
    const grid = this.gridSubj.value
    const selectNode = grid[x]?.[y] || null
    this.selectedSubj.next(selectNode)
  }

  updateNode(node: Nullable<TreeNode>) {
    if (!node) return;

    const grid = this.gridSubj.value.map(row => [...row]);
    const { x, y } = node.position;
    if (grid[y]?.[x]) {
      grid[y][x] = { ...node };
      this.gridSubj.next(grid);
    }
  }
}
