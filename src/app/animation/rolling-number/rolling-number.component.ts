import {Component, Input} from '@angular/core';

@Component({
    selector: 'rolling-number',
    templateUrl: './rolling-number.component.html',
    styleUrls: ['./rolling-number.component.scss']
})
export class RollingNumberComponent {
    public rollingCharacters: number[] = [];
    private _value: number = 0;
    private size: number = 30;

    @Input()
    set value(newValue: number) {
        if (newValue !== this._value) {
            this._value = newValue;
            this.updateRollingCharacters(newValue);
        }
    }

    private updateRollingCharacters(newValue: number) {
        this.rollingCharacters = newValue.toString().split('').map(Number);
    }

    public getMargin(index: number): string {
        const currentDigit = this.rollingCharacters[index] || 0;
        const marginTop = -(9 - currentDigit) * this.size;
        return `${marginTop}px`;
    }
}
