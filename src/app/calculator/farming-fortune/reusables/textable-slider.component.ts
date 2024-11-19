import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NumNumFunc, NumStringFunc } from '../../../../interfaces/functions';
import { debounceTime, Subject } from 'rxjs';

@Component({
    selector: 'slider',
    template: `
    <div class="item {{label}}">
    <label [for]="label" class="form-label">
        {{ preString }} {{ displayValue }} {{ extraStr }}
        <div class="res">
          {{ calculatedValue }} <str />
        </div>
    </label>
    <input type="range" class="form-range" 
      [id]="label" [min]="min" [max]="max" [step]="step" 
      [value]="value" (input)="onSliderInput($event)" />
    </div>
  `,
    styles: ['.form-label { margin-bottom: 0; display: flex; justify-content: space-between; }'],
    standalone: false
})
export class TextableSliderComponent {
  @Input() label!: string;
  @Input() preString!: string;
  @Input() min!: number;
  @Input() max!: number;
  @Input() step: number = 1;
  @Input() value!: number;
  @Input() fromValue!: NumNumFunc;
  @Input() display: NumStringFunc = (v) => v.toString();
  @Input() extraStr: string = '';

  @Output() valueChange = new EventEmitter<number>();

  private sliderInput$ = new Subject<number>();

  constructor() {
    this.sliderInput$.pipe(debounceTime(200)).subscribe(value => {
      this.value = value;
      this.valueChange.emit(value);
    });
  }

  get calculatedValue() {
    return this.fromValue(this.value);
  }

  get displayValue() {
    if (typeof this.display === 'string') {
      return this.display;
    } else {
      return this.display(this.value);
    }
  }

  onSliderInput(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.sliderInput$.next(value);
  }
}
