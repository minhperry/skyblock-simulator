import {Component, DestroyRef, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {DAY, HOUR, MAYOR_PERKS_DATA, MayorData, MayorEvent} from '../../../interfaces/jerry';
import {ActivatedRoute} from '@angular/router';
import {SingleMayorViewComponent} from '../single-mayor-view/single-mayor-view.component';
import {NullableInterval} from '../../../services/utils';
import {FormsModule} from '@angular/forms';
import {ToggleSwitch} from 'primeng/toggleswitch';
import {JerryProgressComponent} from '../jerry-progress/jerry-progress.component';

@Component({
  selector: 'sb-mayor-cycle',
  templateUrl: './mayor-cycle.component.html',
  imports: [
    SingleMayorViewComponent,
    FormsModule,
    ToggleSwitch,
    JerryProgressComponent
  ],
  styleUrl: './mayor-cycle.component.scss'
})
export class MayorCycleComponent implements OnInit, OnDestroy {
  // Input from route
  absoluteStartTime!: number
  month!: string
  order!: string[]

  currentTime = this.nowSignal()
  private cycleLength = 6 * HOUR

  mayors: MayorData[] = [];

  private route = inject(ActivatedRoute)
  private interval: NullableInterval = null

  showSecondSig = signal(false)

  ngOnInit(): void {
    // Fetch data from the route
    this.route.data.subscribe(data => {
      this.absoluteStartTime = data['start'];
      this.month = data['month'];
      this.order = data['order'];
    });
    // Fill the mayor list with the data until Jerry's end
    this.extendMayorListUntilEnd()
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private extendMayorListUntilEnd(): void {
    const totalDuration = 5 * DAY + 4 * HOUR;
    const totalSlots = Math.floor(totalDuration / this.cycleLength);

    for (let i = 0; i <= totalSlots; i++) {
      const mayorIndex = i % this.order.length;
      const mayorOrderIndex = Math.floor(i / this.order.length) % this.order.length + 1;
      const mayorName = this.order[mayorIndex];

      const currentStart = this.absoluteStartTime + (i * this.cycleLength);
      const currentMayorPerks = MAYOR_PERKS_DATA[mayorName];

      const doesCurrentHaveEvent = currentMayorPerks.eventDuration !== undefined;

      let toBeAdded: MayorData

      if (doesCurrentHaveEvent) {
        toBeAdded = new MayorData(
          {
            name: `${mayorName} #${mayorOrderIndex}`,
            imageSrc: currentMayorPerks.imageSrc,
            perks: currentMayorPerks.perks
          },
          currentStart,
          new MayorEvent(
            currentStart,
            currentMayorPerks.eventDuration!,
            currentMayorPerks.eventMessage!
          )
        )
      } else {
        toBeAdded = new MayorData(
          {
            name: `${mayorName} #${mayorOrderIndex}`,
            imageSrc: currentMayorPerks.imageSrc,
            perks: currentMayorPerks.perks
          },
          currentStart
        )
      }
      this.mayors.push(toBeAdded)
    }
  }

  // region Helpers
  isMayorActive(mayor: MayorData): boolean {
    const startTime = mayor.startTime
    const endTime = startTime + this.cycleLength

    return this.currentTime() >= startTime && this.currentTime() < endTime
  }

  nowSignal(intervalMs = 500) {
    const now = signal(Date.now() / 1000);
    const destroyRef = inject(DestroyRef)

    const timer = setInterval(() => {
      now.set(Date.now() / 1000);
    }, intervalMs);

    destroyRef.onDestroy(() => {
      clearInterval(timer);
    });

    return now;
  }

  // endregion
}