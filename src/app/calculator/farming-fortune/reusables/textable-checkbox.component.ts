import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {StrengthComponent} from '../../strength.comp';
import {Checkbox, CheckboxChangeEvent} from 'primeng/checkbox';

@Component({
  selector: 'sb-checkbox',
  template: `
    <div class="flex items-center py-1">
      <p-checkbox
              [binary]="true"
              [(ngModel)]="check"
              (onChange)="onCheckboxChange($event)"
              [inputId]="label + '_checkbox'"
              class="mr-2 -translate-y-1" size="small"
      /> <!-- Another bandage fix for checkbox not being vertically alignable -->
      <label [for]="label + '_checkbox'" class="flex-1 cursor-pointer" [innerHTML]="text"></label>

      <div class="ml-auto">
        {{ check ? value : 0 }}
        <sb-str/>
      </div>
    </div>
  `,
  imports: [
    FormsModule,
    StrengthComponent,
    Checkbox
  ]
})
export class TextableCheckboxComponent {
  @Input() label!: string;
  @Input() text!: string;
  @Input() value!: number;
  @Input() check = false;

  @Output() checkChange = new EventEmitter<boolean>();

  onCheckboxChange(event: CheckboxChangeEvent) {
    this.checkChange.emit(event.checked);
  }
}