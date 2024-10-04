import {Component, Input} from '@angular/core';
import {identity} from "rxjs";

@Component({
    selector: 'rolling-number',
    templateUrl: './rolling-number.component.html',
    styleUrls: ['./rolling-number.component.scss']
})
export class RollingNumberComponent {
    public rollingCharacters: string[] = [];
    readonly identity = identity<number>;
    private _value: number = -1;

    @Input() transitionInMs: number = 200;

    @Input() size: number = 30

    @Input()
    set value(newValue: number) {
        if (newValue !== this._value) {
            this._value = newValue;
            this.updateRollingCharacters(newValue);
        }
    }

    private updateRollingCharacters(newValue: number) {
        // this.rollingCharacters = newValue.toString().split('').map(Number);
        this.rollingCharacters = newValue.toString().split('')
    }

    public getMargin(index: number): string {
        const currentChar = this.rollingCharacters[index];
        if (this.isDigit(currentChar)) {
            const currentDigit = parseInt(currentChar, 10);
            const marginTop = -(9 - currentDigit) * this.size;
            return `${marginTop}px`;
        }
        return '0'; // No margin adjustment for non-digit characters
    }

    public getTransition(index: number): string {
        const currentChar = this.rollingCharacters[index];
        return this.isDigit(currentChar) ? `${this.transitionInMs}ms` : 'none'; // No transition for non-digit characters
    }

    public isDigit(char: string): boolean {
        return /^\d$/.test(char)
    }
}
