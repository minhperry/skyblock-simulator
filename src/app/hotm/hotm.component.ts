import {Component, signal} from '@angular/core';
import {TreeNode} from '../../interfaces/hotmData';
import {Nullable} from '../../interfaces/types';

@Component({
  selector: 'sb-hotm',
  templateUrl: './hotm.component.html',
  styleUrl: './hotm.component.scss',
  imports: [
  ]
})
export class HotmComponent {
  grid = signal<Nullable<TreeNode>[][]>([]);

  // Maybe tanstack table is not right for this use case
  // table = createAngularTable(() => ({  }))
  /*
  grid: Nullable<TreeNode>[][] = [];
  selected_: Nullable<TreeNode> = null;
  sigSelected = signal<Nullable<TreeNode>>(null);

  constructor(
    private hotmSS: HotmStateService
  ) {
  }

  ngOnInit() {
    this.initializeGrid()

    //this.hotmSS.grid$.subscribe(grid => this.grid = grid)
    //this.hotmSS.selected$.subscribe(selected => this.selected = selected)
  }

  private initializeGrid() {
    const initGrid: TreeNode[][] = Array.from({length: 10}, () => Array(7).fill(null))

    for (const nodeData of Object.values(InitialHotmTree)) {
      const node = nodeData.perk
      const {x, y} = nodeData.position

      initGrid[y][x] = {
        id: nodeData.id,
        position: {x, y},
        perk: node,
        state: nodeData.state,
      }
    }

    this.hotmSS.initializeGrid(initGrid)
  }

  onCellClick(x: number, y: number) {
    this.hotmSS.selectNode(x, y)
  }

  onCellClick2(x: number, y: number) {
    const node = this.grid[y][x]
    if (node) {
      this.sigSelected.set(node)
    }
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

  /*
  protected modifySelectedLevel_(amount: number) {
    if (!this.selected) return;

    const selected = this.selected
    const curr = selected.state.currentLevel as number;
    const max = selected.perk.maxLevel as number;

    selected.state.currentLevel = Math.min(max, Math.max(1, curr + amount));
    const {x, y} = selected.position;
    this.grid[y][x] = selected;
    // console.log(this.grid[y][x].state.currentLevel)
  }**

  modifySelectedLevel(amount: number) {
    const selected = this.sigSelected();
    if (!selected) return;

    const updatedNode = {
      ...selected,
      state: {
        ...selected.state,
        currentLevel: Math.min(
          selected.perk.maxLevel as number,
          Math.max(1, (selected.state.currentLevel || 0) + amount)
        ),
      },
    };

    this.hotmSS.updateNode(updatedNode);
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

  protected isSelectedEqualNode(selected: Nullable<TreeNode>, node: Nullable<TreeNode>) {
    return selected === node
  }
  */
}
