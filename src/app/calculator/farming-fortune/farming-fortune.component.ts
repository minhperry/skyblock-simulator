import {Component, computed, signal} from '@angular/core';
import {
  CheckBoxItem,
  CheckBoxItemSignal,
  RadioItem,
  RadioItemSignal,
  SliderItem,
  SliderItemSignal
} from '../../../interfaces/input';
import {formatDecimalNoTrailingZero, identity, NumStringFunc, round, zeroOr} from '../../../interfaces/functions';
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
import {Slider} from 'primeng/slider';

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
    ReactiveFormsModule,
    Slider
  ],
  styleUrl: './farming-fortune.component.scss'
})
export class FarmingFortuneComponent {
  defaultDisplay: NumStringFunc = (v) => v.toString();

  // region Sliders Handling

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
      max: 60, step: 1, func: identity
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
  sliderSigs: SliderItemSignal[] = this.sliders.map((sl) => {
    const valSig = signal(sl.value);
    return {
      label: sl.label,
      preString: sl.preString,
      min: sl.min ?? 0,
      max: sl.max,
      step: sl.step,
      value: valSig,
      result: computed(() => sl.func(valSig())),
      display: sl.display ?? this.defaultDisplay,
    }
  });

  onSliderInputChange(newValue: number, index: number) {
    this.sliderSigs[index].value.set(newValue);
  }

  // endregion

  // region Checkboxes Handling

  #checkboxes: CheckBoxItem[] = [
    {check: false, label: 'dnc', value: 5, func: (v) => zeroOr(5, v), text: '<b>Both </b> Day and Night Crystal'},
    {check: false, label: 'cc', value: 2, func: (v) => zeroOr(2, v), text: 'aPunch Century Cake'},
    {
      check: false,
      label: 'gpot',
      value: 78.75,
      func: (v) => zeroOr(78.75, v),
      text: 'God Potion: Strength Effect'
    },
    {check: false, label: 'jer', value: 20, func: (v) => zeroOr(20, v), text: 'Jerry Candy'},
    {check: false, label: 'aow', value: 5, func: (v) => zeroOr(5, v), text: 'The Art of War'},
  ]
  checkboxSig: CheckBoxItemSignal[] = this.#checkboxes.map((cb) => {
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
  radioSig: RadioItemSignal[] = this.radios.map((r) => {
    return {
      title: r.title,
      label: r.label,
      options: r.options,
      choice: signal(r.choice),
    }
  });

  onChoiceChange(newValue: number, index: number) {
    this.radioSig[index].choice.set(newValue);
  }

  // endregion

  totalStrSig = computed(() => {
    let total = 0;
    // Add all the values from the checkboxes
    this.checkboxSig.forEach((cbs) => {
      total += cbs.result();
    })
    // then the sliders
    this.sliderSigs.forEach((sl) => {
      total += sl.result();
    })
    // then the radio buttons
    this.radioSig.forEach((r) => {
      total += r.choice();
    })
    // And at last the strength from the mp + tuning
    total += this.computedStr() + this.tuningField();
    return total
  })

  // region MP Input and Tuning
  mpField = signal<Nullable<number>>(null);

  tuningField = computed(() => Math.floor((this.mpField() ?? 0) / 10));

  computedStr = computed(() => {
    const mpInt = this.mpField() ?? 0;

    const strFromMP = 0.75 * 719.28 * Math.pow(Math.log(1 + (0.0019 * mpInt)), 1.2);
    return round(strFromMP);
  })

  // endregion

  // region Pets Level Slider
  mcowLevel = signal(1);
  mcowFortune = computed(() => (
    this.mcowLevel() + 10 + Math.floor((this.totalStrSig() / (40 - 0.2 * this.mcowLevel())) * 0.7)
  ))

  eleLevel = signal(1);
  eleFortune = computed(() => this.eleLevel() * 1.5)

  winner = computed(() => {
    const mcow = this.mcowFortune();
    const ele = this.eleFortune();
    if (mcow > ele) {
      return 'mcow';
    } else if (ele > mcow) {
      return 'ele';
    }
    return null;
  })
  // endregion
  protected readonly formatNum = formatDecimalNoTrailingZero;
}

