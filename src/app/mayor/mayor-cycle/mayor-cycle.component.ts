import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {DAY, HOUR, Mayor, mayorData, MINUTE} from "../../../interfaces/jerry";
import {Utils} from "../../../services/utils";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'sb-mayor-cycle',
  templateUrl: './mayor-cycle.component.html',
  styleUrl: './mayor-cycle.component.scss'
})
export class MayorCycleComponent implements OnInit, OnDestroy {
  absoluteStartTime!: number
  jerryEndTime = this.absoluteStartTime + 5 * DAY + 4 * HOUR

  currentTime: number = Math.floor(Date.now() / 1000);
  eventOffset = 15 * MINUTE
  cycleLength = 6 * HOUR
  month!: string

  mayors: Mayor[] = [];
  private mayorOrder!: string[] //= ['Finnegan', 'Marina', 'Paul', 'Cole', 'Aatrox', 'Diana']
  private fullMayors: string[] = []

  private interval: ReturnType<typeof setInterval> | null = null;

  constructor(@Inject(PLATFORM_ID) private platform: object, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.absoluteStartTime = data['start'];
      this.month = data['month'];
      this.mayorOrder = data['order'];
      this.jerryEndTime = this.absoluteStartTime + 5 * DAY + 4 * HOUR;
    });
    this.updateTime();
    this.extendMayorNamesUntilJerryEnd()
    this.mayors = this.fullMayors.map(name => {
      const data = mayorData[name];
      return {
        name: name,
        imageSrc: data?.imageSrc,
        eventDuration: data?.eventDuration,
        eventName: data?.eventMessage,
        perks: data?.perks
      } as Mayor;
    })
    Utils.doIfBrowser(this.platform, () => {
      this.interval = setInterval(() => this.updateTime(), 1000);
    })
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  getLocalTime(unixTime: number): string {
    return new Date(unixTime * 1000).toLocaleString([], {
      hour: '2-digit', minute: '2-digit',
      day: 'numeric', year: 'numeric', month: "numeric"
    });
  }

  getMayorStartTime(index: number): number {
    return this.absoluteStartTime + (index * 6 * HOUR);
  }

  getMayorEndTime(index: number): number {
    return this.getMayorStartTime(index) + 6 * HOUR;
  }

  getRelativeTime(index: number): string {
    const startTime = this.getMayorStartTime(index);
    const endTime = this.getMayorEndTime(index);

    const timeDiffStart = startTime - this.currentTime;
    const timeDiffEnd = endTime - this.currentTime;

    if (timeDiffStart > 0) {
      return `<p class="text-success">In ${this.formatTimeDifference(timeDiffStart)}</p>`;
    } else if (timeDiffEnd > 0) {
      return `<p class="text-light"><b>Ends in ${this.formatTimeDifference(timeDiffEnd)}</b></p>`;
    } else {
      return `<p class="text-danger">${this.formatTimeDifference(-timeDiffEnd)} ago</p>`;
    }
  }

  private formatTimeDifference(timeInSeconds: number): string {
    const hours = Math.floor(timeInSeconds / HOUR);
    const minutes = Math.floor((timeInSeconds % HOUR) / MINUTE);
    return `${hours}h${minutes}m`;
  }

  private getMayorEventTime(index: number): number {
    return this.getMayorStartTime(index) + this.eventOffset;
  }

  private updateTime(): void {
    this.currentTime = Math.floor(Date.now() / 1000);
  }

  isMayorActive(index: number): boolean {
    const startTime = this.getMayorStartTime(index);
    const endTime = startTime + (6 * HOUR);
    return this.currentTime >= startTime && this.currentTime < endTime && this.currentTime < this.jerryEndTime;
  }

  isEventActive(mayor: Mayor, index: number): boolean {
    const eventStartTime = this.getMayorEventTime(index);
    if (mayor.eventDuration) {
      return this.currentTime >= eventStartTime && this.currentTime < eventStartTime + (mayor.eventDuration * MINUTE);
    }
    return false;
  }

  getTimeLeftUntilEventEnds(mayor: Mayor, index: number): string {
    if (mayor.eventDuration === undefined) return '';
    const eventStartTime = this.getMayorEventTime(index);
    const eventEndTime = eventStartTime + (mayor.eventDuration * MINUTE);
    const timeLeft = eventEndTime - this.currentTime;

    if (timeLeft > 0) {
      const hours = Math.floor(timeLeft / HOUR);
      const minutes = Math.floor((timeLeft % HOUR) / MINUTE);
      const seconds = Math.floor((timeLeft % MINUTE));
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return 'Event ended';
  }

  private extendMayorNamesUntilJerryEnd(): void {
    const totalDuration = this.jerryEndTime - this.absoluteStartTime;
    const totalSlots = Math.floor(totalDuration / this.cycleLength);

    for (let i = 0; i <= totalSlots; i++) {
      const mayorIndex = i % this.mayorOrder.length;
      this.fullMayors.push(this.mayorOrder[mayorIndex]);
    }
  }

  showPerks(event: MouseEvent, mayor: Mayor): void {
    const tooltip = document.getElementById('perks-popup');
    if (tooltip) {
      const tooltipContent = document.getElementById('perks-content');
      if (tooltipContent) {
        let perksList = mayor.perks?.map(perk =>
          `<div><b class="mc green">${perk.name}</b><br><p>${perk.desc}</p></div>`
        ).join('') || '';

        if (mayor.eventDuration) {
          const eventStartTime = this.getMayorEventTime(this.mayors.indexOf(mayor));
          const formattedEventStartTime = this.getLocalTime(eventStartTime);
          perksList += `<div class="mt-2"><b class="mc blue">${mayor.eventName} starts at ${formattedEventStartTime}</b></div>`;
        }

        tooltipContent.innerHTML = perksList
      }
      this.updateTooltipPosition(event);
      tooltip.classList.add('show');
    }
  }

  hidePerks(): void {
    const tooltip = document.getElementById('perks-popup');
    if (tooltip) {
      tooltip.classList.remove('show');
    }
  }

  togglePerks(event: MouseEvent, mayor: Mayor): void {
    if (event.type === 'click') {
      this.showPerks(event, mayor);
    }
  }

  updateTooltipPosition(event: MouseEvent): void {
    const tooltip = document.getElementById('perks-popup');
    if (tooltip) {
      const screenWidth = window.innerWidth;
      const cursorPositionX = event.pageX;

      const openToLeft = cursorPositionX < screenWidth / 2;

      if (openToLeft) {
        tooltip.classList.add('right');
        tooltip.classList.remove('left');
        tooltip.style.left = `${event.pageX + 10}px`;
        tooltip.style.right = 'auto';
      } else {
        tooltip.classList.add('left');
        tooltip.classList.remove('right');
        tooltip.style.right = `${screenWidth - event.pageX + 10}px`;
        tooltip.style.left = 'auto';
      }

      tooltip.style.top = `${event.pageY + 10}px`;
    }
  }
}
