import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: 'radio',
  template: `
    <div class="radio-group">
      <label *ngFor="let option of options">
        <input type="radio" 
               [value]="option.value" 
               [name]="name"
               [checked]="option.value === selectedValue"
               (change)="onSelectionChange(option.value)" />
        <span [innerHTML]="option.text"></span>
      </label>
    </div>
  `,
  styles: [
    '.radio-group label { display: block; margin-bottom: 0.5em; }',
    'input[type="radio"] { margin-right: 0.5em; }'
  ]
})
export class RadioComponent {
  @Input() options: { value: any, text: string }[] = [];
  @Input() name: string = '';
  @Input() selectedValue: any;

  @Output() selectionChange = new EventEmitter<any>();

  onSelectionChange(value: any) {
    this.selectedValue = value;
    this.selectionChange.emit(value);
  }
}
