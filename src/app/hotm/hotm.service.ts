import {computed, Injectable, signal, WritableSignal} from '@angular/core';
import {Nullable} from '../../interfaces/types';
import {
  getDescriptionCalculated, getPowderAmount,
  HotmTreeData,
  initStateByType,
  Position,
  TreeNodeConstants,
  TreeNodeDynamics
} from './hotmData';


@Injectable({
  providedIn: 'root'
})
export class HotmService {
  gridConstant: TreeNodeConstants[][]
  gridData: TreeNodeDynamics[][];
  selectedPos: WritableSignal<Nullable<Position>>

  constructor() {
    // Initialize the grids with null values
    this.gridConstant = Array.from({length: 10}, () => Array(7).fill(null));
    this.gridData = Array.from({length: 10}, () => Array(7).fill(null));

    this.selectedPos = signal(null);

    // Now replace with the actual data
    for (const node of Object.values(HotmTreeData)) {
      const perk = node.perk
      const {x, y} = node.position
      this.gridConstant[y][x] = {
        id: node.id,
        position: {x, y},
        perk,
        type: node.type,
      }
      this.gridData[y][x] = {
        id: node.id,
        data: initStateByType(node.type)
      }
    }
  }

  // Processors, based on selected position -> Ensured to take a non-null position

  formattedDescription = computed(() => {
    const pos = this.selectedPos()
    if (!pos) return '';
    const nodeConst = this.getNonNullConstantsAt(pos)
    const nodeDyn = this.getNonNullDynamicsAt(pos)

    return getDescriptionCalculated(nodeConst, nodeDyn)
  })

  formattedPowderCost = computed(() => {
    const pos = this.selectedPos()
    if (!pos) return '';
    const nodeConst = this.getNonNullConstantsAt(pos)
    const nodeDyn = this.getNonNullDynamicsAt(pos)

    return getPowderAmount(nodeConst, nodeDyn)
  })

  // Helpers and getters
  private getConstantsAt(pos: Position): Nullable<TreeNodeConstants> {
    return this.gridConstant[pos.y][pos.x];
  }

  getNonNullConstantsAt(pos: Position): TreeNodeConstants {
    return this.getConstantsAt(pos) as TreeNodeConstants;
  }

  private getDynamicsAt(pos: Position): Nullable<TreeNodeDynamics> {
    return this.gridData[pos.y][pos.x];
  }

  getNonNullDynamicsAt(pos: Position): TreeNodeDynamics {
    return this.getDynamicsAt(pos) as TreeNodeDynamics;
  }
}