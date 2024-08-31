import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'checkbox',
    template: `
      <div class="item {{label}}">
      <label [for]="label" class="form-label">
          <input type="checkbox" [(checked)]="check" (change)="onCheckboxChange($event)" ngDefaultControl>
          <span [innerHTML]="text"> </span> 
          <div class="res">{{ value }} <str /></div>
      </label>
      </div>
    `,
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