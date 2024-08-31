import { Component, EventEmitter, Input, Output } from '@angular/core';

type Func = (val: number) => number;

@Component({
  selector: 'slider',
  template: `
    <div class="item {{label}}">
    <label [for]="label" class="form-label">
        {{ preString }} {{ value }} {{ extraStr }}
        <div class="res">
          {{ calculatedValue }} <str />
        </div>
    </label>
    <input type="range" class="form-range" 
      [id]="label" [min]="min" [max]="max" [step]="step" 
      [(ngModel)]="value" (ngModelChange)="onValueChange($event)" 
      ngDefaultControl>
    </div>
  `,
  styles: ['.form-label { margin-bottom: 0; display: flex; justify-content: space-between; }']
})
export class TextableSliderComponent {
  @Input() label!: string;
  @Input() preString!: string;
  @Input() min!: number;
  @Input() max!: number;
  @Input() step: number = 1;
  @Input() value: number = 0;
  @Input() fromValue!: Func;
  @Input() extraStr: string = '';

  @Output() valueChange = new EventEmitter<number>();

  get calculatedValue(): number {
    return this.fromValue(this.value);
  }

  onValueChange(value: number) {
    this.value = value;
    this.valueChange.emit(value);
  }
}
