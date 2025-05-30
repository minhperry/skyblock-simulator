import {Component, Input} from '@angular/core';
import {identity} from "rxjs";

@Component({
    selector: 'sb-rolling-number',
    templateUrl: './rolling-number.component.html',
    styleUrls: ['./rolling-number.component.scss']
})
export class RollingNumberComponent {
    public rollingCharacters: string[] = [];
    readonly identity = identity<number>;
    private _value = -1;

    @Input() transitionInMs = 200;

    @Input() size = '30px'

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
            return `calc(-${9 - currentDigit} * ${this.size})`;
        }
        return '0';
    }

    public getTransition(index: number): string {
        const currentChar = this.rollingCharacters[index];
        return this.isDigit(currentChar) ? `${this.transitionInMs}ms` : 'none';
    }

    public isDigit(char: string): boolean {
        return /^\d$/.test(char)
    }
}
