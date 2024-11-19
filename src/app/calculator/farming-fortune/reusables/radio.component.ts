import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RadioMapItem } from "../../../../interfaces/input";

@Component({
    selector: 'radio',
    template: `
    <div class="title">
        <span class="title-text">{{title}}</span>
        <span class="choice">{{choice}} <str/></span>
    </div>
    <div class="options">
        <label *ngFor="let option of options" class="option">
            <input type="radio" 
                [value]="option.value" 
                [name]="label"
                [checked]="option.value === choice"
                (change)="onSelectionChange(option.value)" />
            <span [innerHTML]="option.text"></span>
        </label>
    </div>
  `,
    styles: [
        '.title { display: flex; }',
        '.title-text { margin-right: auto; font-size: 1.2em; }',
        '.options { display: flex; flex-direction: column; }',
        '.option { margin-left: 1em; }',
        'input[type="radio"] { margin-right: 0.5em; }',
        '.choice { margin-left: auto; }'
    ]
})
export class RadioComponent {
  @Input() options: RadioMapItem[] = [];
  @Input() title!: string;
  @Input() label!: string;
  @Input() choice: any;

  @Output() choiceChange = new EventEmitter<any>();

  onSelectionChange(value: any) {
    this.choice = value;
    this.choiceChange.emit(value);
  }
}
