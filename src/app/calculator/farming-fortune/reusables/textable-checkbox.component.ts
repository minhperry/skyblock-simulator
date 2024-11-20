import { Component, EventEmitter, Input, Output } from "@angular/core";
import {FormsModule} from "@angular/forms";
import {StrengthComponent} from "../../strength.comp";

@Component({
    selector: 'checkbox',
    template: `
        <div class="item {{label}}">
            <label [for]="label" class="form-label">
                @if (check) {
                    <input type="checkbox" (change)="onCheckboxChange($event)" ngDefaultControl checked>
                } @else {

                    <input type="checkbox" (change)="onCheckboxChange($event)" ngDefaultControl>
                }
                <span [innerHTML]="text"> </span>
                <div class="res">{{ check ? value : 0 }}
                    <str/>
                </div>
            </label>
        </div>
    `,
    imports: [
        FormsModule,
        StrengthComponent
    ],
    styles: [
        '.form-label { margin-bottom: 0; display: flex; justify-content: flex-start; }',
        'input[type="checkbox"] { margin-right: 0.5em; }',
        '.res { margin-left: auto; }'
    ]
})
export class TextableCheckboxComponent {
    @Input() label!: string;
    @Input() text!: string;
    @Input() value!: number;
    @Input() check: boolean = false;

    @Output() checkChange = new EventEmitter<boolean>();

    onCheckboxChange(event: Event) {
        this.checkChange.emit((event.target as HTMLInputElement).checked);
    }
}