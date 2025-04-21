import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NumNumFunc, NumStringFunc } from '../../../../interfaces/functions';
// import { debounceTime, Subject } from 'rxjs';
import {StrengthComponent} from "../../strength.comp";
import {Slider, SliderChangeEvent} from 'primeng/slider';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'sb-slider',
  template: `
    <div>
      <!-- First row displaying text and str -->
      <div class="flex justify-between mb-0">
        <label [for]="label + '_slider'">
          {{ preString }} {{ displayValue }}
        </label>
        <div>
          {{ calculatedValue }}
          <sb-str/>
        </div>
      </div>
      <div class="my-3">
        <p-slider
                [id]="label + '_slider'"
                [min]="min" [max]="max" [step]="step"
                [(ngModel)]="value"
                (onChange)="onSliderInput($event)"
        />
      </div>
    </div>
  `,
  imports: [
    StrengthComponent,
    Slider,
    FormsModule
  ],
  styles: [
    `:host ::ng-deep .p-slider {
      height: 8px !important;
      @apply rounded;
    }

    :host ::ng-deep .p-slider-range {
      @apply rounded;
    }

    ;`
  ]
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

  // private sliderInput$ = new Subject<number>();

  /*
  __constructor() {
    this.sliderInput$.pipe(debounceTime(200)).subscribe(value => {
      this.value = value;
      this.valueChange.emit(value);
    });
  }
  */

  get calculatedValue() {
    return this.fromValue(this.value);
  }

  get displayValue() {
    return this.display(this.value);
  }

  onSliderInput(event: SliderChangeEvent) {
    const value = event.value as number;
    // this.sliderInput$.next(value);
    this.valueChange.emit(value)
  }
}
