import {Component} from '@angular/core';
import {BasePower, Color, PowerStone, Stats, StatsMultiplier} from "../../interfaces/base-power";

interface ColumnConfig {
    key: string,
    headerText: string,
    styles?: any,
    unicode?: any
}

type NumOrString = number | string

@Component({
    selector: 'app-live-mp',
    templateUrl: './live-mp.component.html',
    styleUrl: './live-mp.component.scss'
})
export class LiveMpComponent {
    columnConfigs: ColumnConfig[] = [
        { key: 'name', headerText: 'Power Stone Name', styles: { color: 'inherit' } },
        { key: 'health', headerText: 'Health', unicode: '2764', styles: { color: Color.RED } },
        { key: 'def', headerText: 'Defense', unicode: '2748', styles: { color: Color.GREEN } },
        { key: 'speed', headerText: 'Speed', unicode: '2726', styles: { color: Color.WHITE } },
        { key: 'strength', headerText: 'Strength', unicode: '2741', styles: { color: Color.RED } },
        { key: 'int', headerText: 'Int', unicode: '270E', styles: { color: Color.AQUA } },
        { key: 'critChance', headerText: 'Crit Chance', unicode: '2623', styles: { color: Color.BLUE } },
        { key: 'critDmg', headerText: 'Crit Damage', unicode: '2620', styles: { color: Color.BLUE} },
        { key: 'atkSpd', headerText: 'Atk Speed', unicode: '2694', styles: { color: Color.YELLOW } },
        { key: 'trueDef', headerText: 'True Def', unicode: '2742', styles: { color: Color.WHITE } },
        { key: 'vitality', headerText: 'Vitality', unicode: '2668', styles: { color: Color.DARK_RED } },
        { key: 'mending', headerText: 'Mending', unicode: '2604', styles: { color: Color.GREEN } }
    ];
    protected readonly stats = Stats
    protected readonly multiplier = StatsMultiplier

    magicalPower: number | undefined = undefined

    getBasePowerValue(stone: PowerStone, column: string): NumOrString {
        if (column === 'name') {
            return stone.name
        }
        return stone.basePower[column as keyof BasePower] ?? 'sex';
    }

    calculate(stone: PowerStone, column: string): string {
        let colKey = column as keyof BasePower

        const basePower = stone.basePower[colKey]
        const mult = this.multiplier[colKey]
        const bonus = stone.bonus?.[colKey] ?? 0

        if (basePower == undefined || mult == undefined) {
            return ''
        }

        if (this.magicalPower == undefined)
            return '-'

        let val = (basePower / 100) * mult * 719.28 * Math.pow(Math.log(1 + 0.0019 * this.magicalPower), 1.2) + bonus
        return (val !== 0) ? val.toFixed(0) : '-'
    }

    toHex(str: string): string {
        return '&#x' + str + ';'
    }
}
