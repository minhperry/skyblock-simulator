import {Component, Input} from '@angular/core';

@Component({
    selector: 'rolling-number',
    templateUrl: './rolling-number.component.html',
    styleUrls: ['./rolling-number.component.scss']
})
export class RollingNumberComponent {
    private _value: number = 0; // The current number to display
    public rollingCharacters: number[] = []; // Array for the current number's digits
    private size: number = 30;

    @Input()
    set value(newValue: number) {
        if (newValue !== this._value) {
            this._value = newValue;
            this.updateRollingCharacters(newValue);
        }
    }

    private updateRollingCharacters(newValue: number) {
        // Delay the update to allow CSS transitions to apply smoothly
        setTimeout(() => {
            this.rollingCharacters = newValue.toString().split('').map(Number);
        }, 0);
    }

    public getMargin(index: number): string {
        const currentDigit = this.rollingCharacters[index] || 0;
        const marginTop = -(9 - currentDigit) * this.size; // Negative offset based on the current digit
        return `${marginTop}px`;
    }
}
