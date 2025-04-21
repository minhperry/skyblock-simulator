import {Component, computed, signal} from '@angular/core';
import {CheckBoxItem, CheckBoxItemSignal, RadioItem, SliderItem} from '../../../interfaces/input';
import {identity, NumStringFunc, round} from '../../../interfaces/functions';
import {FarmingFortunesComponent} from '../ff.comp';
import {StrengthComponent} from '../strength.comp';
import {TextableSliderComponent} from './reusables/textable-slider.component';
import {TextableCheckboxComponent} from './reusables/textable-checkbox.component';
import {RadioComponent} from './reusables/radio.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from 'primeng/accordion';
import {InputGroup} from 'primeng/inputgroup';
import {InputGroupAddon} from 'primeng/inputgroupaddon';
import {InputNumber} from 'primeng/inputnumber';
import {Nullable} from '../../../interfaces/types';

@Component({
  selector: 'sb-farming-fortune',
  templateUrl: './farming-fortune.component.html',
  imports: [
    FarmingFortunesComponent,
    StrengthComponent,
    TextableSliderComponent,
    TextableCheckboxComponent,
    RadioComponent,
    FormsModule,
    NgClass,
    Accordion,
    AccordionHeader,
    AccordionContent,
    AccordionPanel,
    InputGroup,
    InputGroupAddon,
    InputNumber,
    ReactiveFormsModule
  ],
  styleUrl: './farming-fortune.component.scss'
})
export class FarmingFortuneComponent {
  defaultDisplay: NumStringFunc = (v) => v.toString();

  // Todo: signal-izing the whole component

  sliders: SliderItem[] = [
    {
      label: 'blaze-slayer', preString: 'Blaze Slayer Level', value: 0,
      max: 9, step: 1, func: (v) => v < 2 ? 0 : (v < 6 ? 1 : 2)
    }, {
      label: 'foraging', preString: 'Foraging Level', value: 0,
      max: 50, step: 1, func: (v) => v <= 14 ? v : 14 + 2 * (v - 14)
    }, {
      label: 'sb-level', preString: 'Skyblock Level', value: 0,
      max: 500, step: 5, func: (v) => Math.floor(v / 5)
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
    }, {
      label: 'pot', preString: 'Potato Books: ', value: 0,
      max: 15, step: 1, func: (v) => v * 2
    }
  ]
  sliderSigs = this.sliders.map((sl) => {
    return {
      label: sl.label,
    }
  });

  // region Checkboxes Handling

  checkboxes: CheckBoxItem[] = [
    {check: false, label: 'dnc', value: 5, func: (v) => this.zeroOr(5, v), text: '<b>Both </b> Day and Night Crystal'},
    {check: false, label: 'cc', value: 2, func: (v) => this.zeroOr(2, v), text: 'aPunch Century Cake'},
    {
      check: false,
      label: 'gpot',
      value: 78.75,
      func: (v) => this.zeroOr(78.75, v),
      text: 'God Potion: Strength Effect'
    },
    {check: false, label: 'jer', value: 20, func: (v) => this.zeroOr(20, v), text: 'Jerry Candy'},
    {check: false, label: 'aow', value: 5, func: (v) => this.zeroOr(5, v), text: 'The Art of War'},
  ]
  checkboxSig: CheckBoxItemSignal[] = this.checkboxes.map((cb) => {
    const checkedSig = signal(cb.check);
    return {
      check: checkedSig,
      label: cb.label,
      value: cb.value,
      result: computed(() => checkedSig() ? cb.value : 0),
      text: cb.text,
    }
  });

  onCheckboxChecked(newValue: boolean, index: number) {
    this.checkboxSig[index].check.set(newValue);
  }

  // endregion

  // region Radio Button Handling
  radios: RadioItem[] = [
    {
      title: 'Burststopper Line',
      label: 'bst',
      choice: 0, options: [
        {value: 0, text: 'None'},
        {value: 1, text: 'Talisman'},
        {value: 2, text: 'Artifact'},
      ]
    }, {
      title: 'Shark Necklace Line',
      label: 'sn',
      choice: 0, options: [
        {value: 0, text: 'None'},
        {value: 2, text: 'Raggedy (Common)'},
        {value: 4, text: 'Dull (Uncommon)'},
        {value: 6, text: 'Honed (Rare)'},
        {value: 8, text: 'Sharp (Epic)'},
        {value: 10, text: 'Razor-sharp (Legendary)'},
      ]
    }, {
      title: 'Artifact/Relic of Power Line (with Perfect Jasper)',
      label: 'arop',
      choice: 0, options: [
        {value: 0, text: 'None'},
        {value: 4.5, text: 'Rare Artifact'},
        {value: 5.5, text: 'Epic Artifact'},
        {value: 6.5, text: 'Legendary Relic'},
        {value: 8, text: 'Mythic Relic'},
      ]
    }
  ]
  radioSig = this.radios.map((r) => signal(r.choice));

  // endregion


  selectionChanged(value: number, index: number) {
    this.radios[index].choice = value;
    this.calcTotal();
  }

  totalStr = 0;

  calcTotal() {
    this.totalStr = 0;
    this.sliders.forEach(sl => this.totalStr += sl.func(sl.value));
    this.checkboxes.forEach(cb => this.totalStr += cb.func(cb.check));
    this.radios.forEach(r => this.totalStr += r.choice);
    this.totalStr += this.tuning() + this.strengthFromMP;
    this.totalStr = round(this.totalStr);
  }

  /*
  totalComp = computed(() => {
    let total = 0;
    this.sliderSig.forEach((sl, idx) => {
      const calced = sl().
    })
  })

   */

  totalStrSig = computed(() => {
    let total = 0;
    this.checkboxSig.forEach((cbs) => {
      total += cbs.result();
    })
    return total
  })

  mp = signal<Nullable<number>>(null);

  $mp = computed(() => this.mp() ?? 0);
  tuning = computed(() => Math.floor(this.$mp() / 10));

  get strengthFromMP() {
    // https://wiki.hypixel.net/Powers#Stat_Calculation
    const str = 0.75 * 719.28 * Math.pow(Math.log(1 + (0.0019 * this.$mp())), 1.2);
    return round(str);
  }

  get fFortune() {
    const ff = this.totalStr / 20 * 0.7;
    return round(ff);
  }

  get mCowFf() {
    return round(110 + this.fFortune);
  }

  readonly eleFf = 150;

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

  private zeroOr(v: number, state: boolean) {
    return state ? v : 0;
  }
}

