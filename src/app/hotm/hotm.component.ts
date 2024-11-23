import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {AbilityState, InitialHotmTree, PerkState, TreeNode} from "../../interfaces/hotmData";
import {NgClass} from "@angular/common";

import {Nullable} from "../../interfaces/types";
import {autoToHTML as parse} from "@sfirew/minecraft-motd-parser";
import {DomSanitizer} from "@angular/platform-browser";

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
  selected: Nullable<TreeNode> = null;

  constructor(
    // private hotm: HotmBackendService
    @Inject(PLATFORM_ID) private platform: Object,
    private san: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.initializeGrid()
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

  onCellClick(x: number, y: number) {
    console.log(x, y)
    this.selected = this.grid[x][y];
  }

  protected getStateClass(node: Nullable<TreeNode>) {
    return this.asTreeNode(node).state.state
  }

  protected asTreeNode(node: Nullable<TreeNode>): TreeNode {
    return node as TreeNode;
  }

  protected isNotNull(node: Nullable<TreeNode>): boolean {
    return node !== null
  }

  protected isLevelable(node: Nullable<TreeNode>): boolean {
    return !!node?.perk.maxLevel;
  }

  protected isAbility(node: Nullable<TreeNode>): boolean {
    return node ? this.stateIsAbility(node.state.state) : false;
  }

  private stateIsAbility(state: AbilityState | PerkState): boolean {
    return Object.values(AbilityState).includes(state as AbilityState)
  }

  protected parse(content: string | object): string {
    return this.san.bypassSecurityTrustHtml(parse(content)) as string
  }
}
