import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {AbilityState, InitialHotmTree, PerkState, TreeNode} from "../../interfaces/hotmData";
import {NgClass} from "@angular/common";
import {Nullable} from "../../interfaces/types";
import {SafeHtmlPipe} from "../../pipes/safe-html.pipe";
import {PerkFunction, PowderFunction, round} from "../../interfaces/functions";
import {PowderString} from "../../interfaces/symbols";
import {ColorizePipe} from "../../pipes/colorize.pipe";
import {ParseMCPipe} from "../../pipes/parse-mc.pipe";

@Component({
  selector: 'app-hotm',
  templateUrl: './hotm.component.html',
  styleUrl: './hotm.component.scss',
  imports: [
    NgClass,
    SafeHtmlPipe,
    ColorizePipe,
    ParseMCPipe
  ]
})
export class HotmComponent implements OnInit {
  grid: Nullable<TreeNode>[][] = [];
  selected: Nullable<TreeNode> = null;

  constructor(
    // private hotm: HotmBackendService
    @Inject(PLATFORM_ID) private platform: Object,
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
    let selected = this.grid[x][y];
    this.selected = null
    console.log('clicked: ', x, y)
    this.selected = selected
    console.log('selected: ', this.selected?.id, 'level in grid: ', this.grid[x][y]?.state.currentLevel)
  }

  // Helpers

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

  // Processors

  protected modifySelectedLevel(amount: number) {
    if (!this.selected) return;

    const selected = this.selected
    const curr = selected.state.currentLevel as number;
    const max = selected.perk.maxLevel as number;

    selected.state.currentLevel = Math.min(max, Math.max(1, curr + amount));
    const {x, y} = selected.position;
    this.grid[y][x] = selected;
    console.log(this.grid[y][x].state.currentLevel)
  }

  protected getDescCalculated(node: Nullable<TreeNode>) {
    const asTN = this.asTreeNode(node)
    const curr = asTN.state.currentLevel as number;
    const desc = new ColorizePipe().transform(asTN.perk.description);

    const func = asTN.perk.perkFunc as PerkFunction
    const c1 = round(func(curr).first).toString();
    const c2 = round(func(curr).second).toString();
    return desc.replace('#{1}', c1).replace('#{2}', c2);
  }

  protected getPowderAmount(node: Nullable<TreeNode>): string {
    const asTN = this.asTreeNode(node)

    const curr = asTN.state.currentLevel as number;
    const powderFunc = asTN.perk.powderFunc as PowderFunction

    const y = asTN.position.y
    let pType: PowderString;
    if (y >= 7 && y <= 9) {
      pType = PowderString.MITHRIL;
    } else if (y >= 3 && y <= 6) {
      pType = PowderString.GEMSTONE;
    } else {
      pType = PowderString.GLACITE;
    }

    const amountFormatted = powderFunc(curr).toLocaleString('en-US');
    return pType.replace('#{#}', amountFormatted);
  }
}
