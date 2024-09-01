import { Component } from '@angular/core';
import { CheckBoxItem, RadioItem, SliderItem } from '../../../interfaces/input';
import { identity, NumStringFunc } from '../../../interfaces/functions';

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
      max: 9, step: 1, func: (v) => v < 2 ? 0 : (v < 6 ? 1 : 2)
    }, {
      label: 'foraging', preString: 'Foraging Level', value: 0,
      max: 50, step: 1, func: (v) => v <= 14 ? v : 14 + 2 * (v - 14)
    }, {
      label: 'sb-level', preString: 'Skyblock Level', value: 0,
      max: 470, step: 5, func: (v) => Math.floor(v / 5)
    }, {
      label: 'fstr', preString: 'Forbidden Strength', value: 0,
      max: 5, step: 1, func: identity
    }, {
      label: 'bgc', preString: 'Blood God Crest Kill:', value: 0,
      max: 9, step: 1, func: identity,
      display: (v) => (10 ** v).toLocaleString()
    }, {
      label: 'talis', preString: 'Strength Enrichment Count:', value: 0,
      max: 52, step: 1, func: identity
    }, {
      label: 'beacon', preString: 'Beacon ', value: 0,
      max: 5, step: 1, func: (v) => v * 2
    }, {
      label: 'pan', preString: 'Pandora\'s Box Completed Challenges: ', value: 0,
      max: 20, step: 1, func: (v) => Math.floor(v / 2)
    } , {
      label: 'pot', preString: 'Potato Books: ', value: 0,
      max: 15, step: 1, func: (v) => v * 2
    }
  ]

  checkboxes: CheckBoxItem[] = [
    { check: false, label: 'dnc', value: 5, func: (v) => this.zeroOr(5, v), text: '<b>Both </b> Day and Night Crystal' },
    { check: false, label: 'cc', value: 2, func: (v) => this.zeroOr(2, v), text: 'aPunch Century Cake' },
    { check: false, label: 'gpot', value: 78.75, func: (v) => this.zeroOr(78.75, v), text: 'God Potion: Strength Effect' },
    { check: false, label: 'jer', value: 20, func: (v) => this.zeroOr(20, v), text: 'Jerry Candy' },
    { check: false, label: 'aow', value: 5, func: (v) => this.zeroOr(5, v), text: 'The Art of War' },
  ]

  radios: RadioItem[] = [
    {
      title: 'Burststopper Line',
      label: 'bst',
      choice: 0, options: [
        { value: 0, text: 'None' },
        { value: 1, text: 'Talisman'},
        { value: 2, text: 'Artifact'},
      ]
    },  {
      title: 'Shark Necklace Line',
      label: 'sn',
      choice: 0, options: [
        { value: 0, text: 'None' },
        { value: 2, text: 'Raggedy (Common)'},
        { value: 4, text: 'Dull (Uncommon)'},
        { value: 6, text: 'Honed (Rare)'},
        { value: 8, text: 'Sharp (Epic)'},
        { value: 10, text: 'Razor-sharp (Legendary)'},
      ]
    }
  ]

  onStateChange(newState: boolean, index: number) {
    this.checkboxes[index].check = newState;
    this.calcTotal();
  }

  selectionChanged(value: number, index: number) {
    this.radios[index].choice = value;
    this.calcTotal();
  }

  totalStr: number = 0;
  calcTotal() {
    this.totalStr = 0;
    this.sliders.forEach(sl => this.totalStr += sl.func(sl.value));
    this.checkboxes.forEach(cb => this.totalStr += cb.func(cb.check));
    this.radios.forEach(r => this.totalStr += r.choice);
    this.totalStr += this.tuning + this.strengthFromMP;
    this.totalStr = this.round(this.totalStr);
  }

  mp: number | undefined = undefined;
  get $mp() {
    return this.mp ?? 0;
  }
  get tuning() {
    if (this.mp === undefined) return 0;
    return Math.floor(this.mp / 10);
  }
  get strengthFromMP() {
    // https://wiki.hypixel.net/Powers#Stat_Calculation
    let str = 0.75 * 719.28 * Math.pow(Math.log(1 + (0.0019 * this.$mp)), 1.2);
    return this.round(str);
  }
  get fFortune() {
    let ff = this.totalStr / 20 * 0.7;
    return this.round(ff);
  }
  get mCowFf() {
    return this.round(110 + this.fFortune);
  }
  get eleFf() {
    return 150;
  }

  isWinner(item: string): boolean {
    return this.getWinner() === item;
  }

  private getWinner(): 'mcow' | 'ele' | null {
    if (this.mCowFf > this.eleFf) {
      return 'mcow';
    } else if (this.eleFf > this.mCowFf) {
      return 'ele';
    }
    return null;
  }

  private round(num: number) {
    return Math.round(num * 100) / 100;
  }

  private zeroOr(v: number, state: boolean) {
    return state ? v : 0;
  }
}

