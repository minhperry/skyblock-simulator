import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {InitialHotmTree, TreeNode} from "../../interfaces/constantData";
import {NgClass} from "@angular/common";

import {Nullable} from "../../interfaces/types";

@Component({
  selector: 'app-hotm',
  templateUrl: './hotm.component.html',
  styleUrl: './hotm.component.scss',
  imports: [
    NgClass,
  ]
})
export class HotmComponent implements OnInit {
  grid: Nullable<TreeNode>[][] = [];

  constructor(
    // private hotm: HotmBackendService
    @Inject(PLATFORM_ID) private platform: Object,
  ) {
  }

  ngOnInit() {
    this.initializeGrid()
    console.log(this.grid)
  }

  private initializeGrid() {
    this.grid = Array.from({length: 10}, () => Array(7).fill(null));

    for (const nodeData of Object.values(InitialHotmTree)) {
      const node = nodeData.perk
      const {x, y} = nodeData.position

      this.grid[y][x] = {
        id: nodeData.id,
        position: {x, y},
        perk: node,
        state: nodeData.state,
      }
    }
  }

  protected getStateClass(node: Nullable<TreeNode>) {
    return (node as TreeNode).state.state
  }

  protected asTreeNode(node: Nullable<TreeNode>): TreeNode {
    return node as TreeNode;
  }

  protected isNotNull(node: Nullable<TreeNode>) {
    return node !== null
  }
}
