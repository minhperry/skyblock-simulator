import { Component, OnChanges, SimpleChanges } from '@angular/core';

type NumNumFunc = (val: number) => number;
type BoolNumFunc = (val: boolean) => number;

@Component({
  selector: 'farming-fortune',
  templateUrl: './farming-fortune.component.html',
  styleUrl: './farming-fortune.component.scss'
})
export class FarmingFortuneComponent {
  // Lv2 1str, Lv6 2str
  blaze: number = 0;
  fromBlazeSlayer: NumNumFunc = (v) => v < 2 ? 0 : (v < 6 ? 1 : 2);

  // 1-14 1 ea., 15-50 2 ea.
  foraging: number = 0;
  fromForaging: NumNumFunc = (v) => v <= 14 ? v : 14 + 2 * (v - 14);

  // 1 str every 5 lvls
  sbLevel: number = 0;
  fromSbLevel: NumNumFunc = (v) => Math.floor(v / 5);

  fStr: number = 0;
  fromFstrPerk: NumNumFunc = (v) => v;

  sharkNecklace: boolean = false;
  fromSharkNecklace: BoolNumFunc = (v) => this.zeroOr(10, v);

  totalStr: number = 0;
  calcTotal() {
    this.totalStr =
      this.fromBlazeSlayer(this.blaze) +
      this.fromForaging(this.foraging) +
      this.fromSbLevel(this.sbLevel) +
      this.fromFstrPerk(this.fStr) + 
      this.fromSharkNecklace(this.sharkNecklace);
  }

  logState() {
    console.log('necklace: ', this.sharkNecklace, ' -> ', this.fromSharkNecklace(this.sharkNecklace));
  }

  private zeroOr(v: number, state: boolean) {
    return state ? v : 0;
  }
}

