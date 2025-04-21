import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RadioMapItem} from '../../../../interfaces/input';
import {StrengthComponent} from '../../strength.comp';
import {RadioButton} from 'primeng/radiobutton';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'sb-radio',
  template: `
    <div class="flex">
      <span class="mr-auto text-[1.2rem]">{{ title }}</span>
      <span class="ml-auto">{{ choice }}
        <sb-str/></span>
    </div>
    <div class="flex flex-col py-1">
      @for (option of options; track option; let i = $index) {
        <div class="inline-flex items-center gap-2 ml-4">
          <p-radioButton
                  [inputId]="label + '_radio_' + i" size="small"
                  [value]="option.value" [name]="label" [(ngModel)]="choice"
                  (onClick)="onSelectionChange(option.value)"
                  class="-translate-y-1"
          /> <!-- Bandage fix for button not being vertically alignable -->
          <label [innerHTML]="option.text" [for]="label + '_radio_' + i" class="text-base"></label>
        </div>
      }
    </div>
  `,
  imports: [
    StrengthComponent,
    RadioButton,
    FormsModule
  ]
})
export class RadioComponent {
  @Input() options: RadioMapItem[] = [];
  @Input() title!: string;
  @Input() label!: string;
  @Input() choice!: number;

  @Output() choiceChange = new EventEmitter();

  onSelectionChange(value: number) {
    this.choice = value;
    this.choiceChange.emit(value);
  }
}
