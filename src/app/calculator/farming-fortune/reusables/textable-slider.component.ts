import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NumNumFunc, NumStringFunc } from '../../../../interfaces/functions';
import { debounceTime, Subject } from 'rxjs';
import {StrengthComponent} from "../../strength.comp";

@Component({
  selector: 'sb-slider',
  template: `
    <div class="item {{label}}">
      <label [for]="label" class="form-label">
        {{ preString }} {{ displayValue }} {{ extraStr }}
        <div class="res">
          {{ calculatedValue }}
          <sb-str/>
        </div>
      </label>
      <input type="range" class="form-range"
             [id]="label" [min]="min" [max]="max" [step]="step"
             [value]="value" (input)="onSliderInput($event)"/>
    </div>
  `,
  imports: [
    StrengthComponent
  ],
  styles: ['.form-label { margin-bottom: 0; display: flex; justify-content: space-between; }']
})
export class TextableSliderComponent {
  @Input() label!: string;
  @Input() preString!: string;
  @Input() min!: number;
  @Input() max!: number;
  @Input() step = 1;
  @Input() value!: number;
  @Input() fromValue!: NumNumFunc;
  @Input() display: NumStringFunc = (v) => v.toString();
  @Input() extraStr = '';

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
    return this.display(this.value);
  }

  onSliderInput(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.sliderInput$.next(value);
  }
}
