import {Component, computed} from '@angular/core';
import {
  BasePower,
  EXPONENT,
  MULTIPLIER,
  PowerStone,
  SCALING,
  Stats,
  StatsMultiplier
} from '../../interfaces/base-power';
import {Color} from '../../interfaces/color';
import {JsonPipe, NgStyle} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputGroup} from 'primeng/inputgroup';
import {InputNumber} from 'primeng/inputnumber';
import {InputGroupAddon} from 'primeng/inputgroupaddon';
import {Select} from 'primeng/select';
import {Nullable} from 'primeng/ts-helpers';
import {toSignal} from '@angular/core/rxjs-interop';
import {TableModule} from 'primeng/table';
import {InputText} from 'primeng/inputtext';

interface ColumnConfig {
  key: string,
  headerText: string,
  shortText: string,
  styles: { color: string },
  unicode?: string
}

interface SortOption {
  key: string,
  icon?: string,
  color?: string,
  displayText: string
}

interface OrderOption {
  key: string,
  text: string
}

interface RowData {
  id: string,
  name: string,
  stat: BasePower
}

@Component({
  selector: 'sb-live-mp',
  templateUrl: './live-mp.component.html',
  imports: [
    FormsModule,
    InputGroup,
    InputNumber,
    InputGroupAddon,
    Select,
    ReactiveFormsModule,
    JsonPipe,
    TableModule,
    NgStyle,
    InputText
  ],
  styleUrl: './live-mp.component.scss'
})
export class LiveMpComponent {
  columnConfigs: ColumnConfig[] = [
    {key: 'name', headerText: 'Power', shortText: 'Pwr', styles: {color: Color.WHITE}},
    {key: 'health', headerText: 'Health', shortText: 'HP', unicode: '2764', styles: {color: Color.RED}},
    {key: 'def', headerText: 'Defense', shortText: 'DEF', unicode: '2748', styles: {color: Color.GREEN}},
    {key: 'speed', headerText: 'Speed', shortText: 'SPD', unicode: '2726', styles: {color: Color.WHITE}},
    {key: 'strength', headerText: 'Strength', shortText: 'STR', unicode: '2741', styles: {color: Color.RED}},
    {key: 'int', headerText: 'Intelligence', shortText: 'INT', unicode: '270E', styles: {color: Color.AQUA}},
    {key: 'critChance', headerText: 'Crit Chance', shortText: 'CC', unicode: '2623', styles: {color: Color.BLUE}},
    {key: 'critDmg', headerText: 'Crit Damage', shortText: 'CD', unicode: '2620', styles: {color: Color.BLUE}},
    {key: 'atkSpd', headerText: 'Atk Speed', shortText: 'ATK', unicode: '2694', styles: {color: Color.YELLOW}},
    {key: 'trueDef', headerText: 'True Def', shortText: 'TDEF', unicode: '2742', styles: {color: Color.WHITE}},
    {key: 'vitality', headerText: 'Vitality', shortText: 'VIT', unicode: '2668', styles: {color: Color.DARK_RED}},
    {key: 'mending', headerText: 'Mending', shortText: 'MEND', unicode: '2604', styles: {color: Color.GREEN}},
    {key: 'ferocity', headerText: 'Ferocity', shortText: 'FERO', unicode: '2AFD', styles: {color: Color.RED}},
    {
      key: 'combatWisdom',
      headerText: 'Combat Wisdom',
      shortText: 'CW',
      unicode: '262F',
      styles: {color: Color.DARK_AQUA}
    },
    {
      key: 'abilityDamage',
      headerText: 'Ability Damage',
      shortText: 'AD',
      unicode: '0E51',
      styles: {color: Color.RED}
    },
  ];

  // Form control object
  inputFormGroup = new FormGroup({
    magicalPower: new FormControl<number | null>(null),
    selectedSort: new FormControl<Nullable<SortOption>>(null),
    selectedOrder: new FormControl<Nullable<OrderOption>>(null),
    filterByName: new FormControl<Nullable<string>>(null)
  })

  // Options for sorting
  sorterOptions: SortOption[] = this.columnConfigs
    .filter(colCfg => colCfg.key !== 'name') // Exclude the name column
    .map((colCfg) => { // Map the rest to the SortOption type
      return {
        key: colCfg.key,
        icon: colCfg.unicode,
        color: colCfg.styles?.color ?? Color.WHITE,
        displayText: colCfg.headerText,
    }
    })

  // Orders for sorting
  orderOptions: OrderOption[] = [
    {key: 'asc', text: '⬆️ Ascending'},
    {key: 'desc', text: '⬇️ Descending'}
  ]

  // Convert the form control value to a signal to listen to changes
  #mp$ = toSignal(this.inputFormGroup.controls.magicalPower.valueChanges)
  #selSort$ = toSignal(this.inputFormGroup.controls.selectedSort.valueChanges)
  #selOrd$ = toSignal(this.inputFormGroup.controls.selectedOrder.valueChanges)
  #filtName$ = toSignal(this.inputFormGroup.controls.filterByName.valueChanges)

  // Computed signal will change whenever any of the dependencies change
  calculatedDataSignal = computed(() => {
    const mp = this.#mp$() ?? 0;
    const sortBy = this.#selSort$()
    const orderBy = this.#selOrd$()
    const filterBy = this.#filtName$()

    // Map the data to calculated power
    let data = Stats.map(stone => this.calculatePower(stone, mp))

    // If filterBy is not null, filter the data. Happens before sorting
    if (filterBy) {
      data = data.filter(stone => stone.name.toLowerCase().includes(filterBy.toLowerCase()));
    }

    // If sortBy or orderBy is null, return the mapped data
    if (!sortBy || !orderBy) return data;

    // Sort the data based on the selected sort and order
    return [...data].sort((a, b) => {
      const asKey = this.asKeyOfBasePower(sortBy);
      // Initiate the sort key
      const aVal = a.stat[asKey];
      const bVal = b.stat[asKey];

      const aUndef = aVal === undefined;
      const bUndef = bVal === undefined;

      // If a is undefined but b isn’t, push a to end
      if (aUndef && !bUndef) return 1;
      // If b is undefined but a isn’t, push b to end
      if (bUndef && !aUndef) return -1;

      // If both are undefined, or both are defined, sort by the value
      const left = aVal as number;
      const right = bVal as number;
      return orderBy.key === 'asc'
        ? left - right
        : right - left;
    });
  })

  private calculatePower(stone: PowerStone, magicalPower: number): RowData {
    const result: BasePower = {};

    const thePartAfterMultInEquation = MULTIPLIER * Math.log(1 + SCALING * magicalPower) ** EXPONENT;

    // Add the base power processed through the equation to the result first
    for (const keyz in stone.basePower) {
      const key = keyz as keyof BasePower;
      const base = stone.basePower[key] ?? 0;
      const multiplierForStat = StatsMultiplier[key] ?? 0;

      // Round to int
      result[key] = (base / 100) * multiplierForStat * thePartAfterMultInEquation;
    }

    // Then add bonus as a flat value
    for (const bonuz in stone.bonus) {
      const key = bonuz as keyof BasePower;
      const bonus = stone.bonus[key] ?? 0;

      result[key] = (result[key] ?? 0) + bonus;
    }

    // Then round the result to int
    for (const keyz in result) {
      const key = keyz as keyof BasePower;
      result[key] = Math.round(result[key] ?? 0);
    }

    return {
      id: stone.id,
      name: stone.name,
      stat: result
    }
  }

  toHex(str: Nullable<string>): string {
    if (str) return '&#x' + str + ';';
    else return '';
  }

  // Conversion methods for type hinting

  asSortOption(val: unknown) {
    return val as SortOption
  }

  asRowData(val: unknown) {
    return val as RowData
  }

  getBasePowerValue(row: RowData, column: string): number | string {
    if (column === 'name') {
      return row.name
    }
    return row.stat[column as keyof BasePower] ?? '';
  }

  asKeyOfBasePower(val: unknown): keyof BasePower {
    return val as keyof BasePower;
  }
}
