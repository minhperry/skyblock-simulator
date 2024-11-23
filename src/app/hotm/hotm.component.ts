import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {InitialHotmTree, TreeNode} from "../../interfaces/constantData";

@Component({
  selector: 'app-hotm',
  templateUrl: './hotm.component.html',
  styleUrl: './hotm.component.scss'
})
export class HotmComponent implements OnInit {
  nodes: TreeNode[] = [];

  constructor(
    // private hotm: HotmBackendService
    @Inject(PLATFORM_ID) private platform: Object,
  ) {
  }

  ngOnInit() {
    this.initializeGrid()
  }

  private initializeGrid() {
    this.nodes = InitialHotmTree.map(node => ({
      ...node,
      state: {
        ...node.state,
        state: node.state.state,
        currentLevel: node.perk.maxLevel ? 0 : null,
      },
    }));
  }
}
