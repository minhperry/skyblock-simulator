import { Component } from '@angular/core';
import { CheckBoxItem, SliderItem } from '../../../interfaces/input';
import { defaultFunction, NumNumFunc, NumStringFunc } from '../../../interfaces/functions';

@Component({
  selector: 'farming-fortune',
  templateUrl: './farming-fortune.component.html',
  styleUrl: './farming-fortune.component.scss'
})
export class FarmingFortuneComponent {
  defaultDisplay: NumStringFunc = (v) => v.toString();

  sliders: SliderItem[] = [
    {
      label: 'blaze-slayer', preString: 'Blaze Slayer Level', value: 0,
      max: 6, step: 1, func: (v) => v < 2 ? 0 : (v < 6 ? 1 : 2) 
    },
    {
      label: 'foraging', preString: 'Foraging Level', value: 0,
      max: 50, step: 1, func: (v) => v <= 14 ? v : 14 + 2 * (v - 14)
    },
    {
      label: 'sb-level', preString: 'Skyblock Level', value: 0,
      max: 470, step: 5, func: (v) => Math.floor(v / 5),
      extraStr: '(Your nearest lower level)'
    },
    {
      label: 'fstr', preString: 'Forbidden Strength', value: 0,
      max: 5, step: 1, func: defaultFunction
    },
    {
      label: 'bgc', preString: 'Blood God Crest Kill', value: 0,
      max: 9, step: 1, func: defaultFunction,
      display: (v) => this.killCount(v)
    }, 
    {
      label: 'talis', preString: 'Strength Enrichment Count:', value: 0,
      max: 52, step: 1, func: (v) => v,
    }
  ]

  totalStr: number = 0;
  calcTotal() {
    this.totalStr = 0;
    this.sliders.forEach(sl => this.totalStr += sl.func(sl.value));
    this.checkboxes.forEach(cb => this.totalStr += cb.func(cb.check));
  }

  onStateChange(newState: boolean, index: number) {
    this.checkboxes[index].check = newState;
    this.calcTotal();
  }

  checkboxes: CheckBoxItem[] = [
    { check: false, label: 'dnc', value: 5, func: (v) => this.zeroOr(5, v), text: '<b>Both </b> Day and Night Crystal' },
    { check: false, label: 'sn', value: 10, func: (v) => this.zeroOr(10, v), text: 'Shark Necklace' },
  ]

  private killCount(digit: number) { 
    return (10 ** digit).toLocaleString();
  }

  private zeroOr(v: number, state: boolean) {
    return state ? v : 0;
  }
}

