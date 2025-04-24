import {
  Component,
  HostListener,
  input,
  signal,
  Inject, inject
} from '@angular/core';
import {HOUR, MayorData, MayorTime, MINUTE} from '../../../interfaces/jerry';
import {DOCUMENT, NgClass, NgStyle} from '@angular/common';
import {MayorCycleComponent} from '../mayor-cycle/mayor-cycle.component';

type TimeStringTuple = [MayorTime, string]

@Component({
  selector: 'sb-single-mayor-view',
  imports: [
    NgStyle,
    NgClass
  ],
  templateUrl: './single-mayor-view.component.html',
  styleUrl: './single-mayor-view.component.scss'
})
export class SingleMayorViewComponent {
  // Inputs
  mayor = input.required<MayorData>()
  isActive = input<boolean>(false)
  showSecond = input<boolean>(false)

  // Internal states
  isBeingHovered = signal(false)
  tooltipPos = {x: 0, y: 0}

  #parent = inject(MayorCycleComponent)
  now = this.#parent.currentTime

  // DOM objects
  #window: Window
  screenWidth: number

  constructor(@Inject(DOCUMENT) private doc: Document) {
    this.#window = this.doc.defaultView!
    this.screenWidth = this.#window.innerWidth
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = this.#window.innerWidth
  }

  @HostListener('touchstart', ['$event'])
  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event: MouseEvent) {
    this.isBeingHovered.set(true)
    this.initializeLocation(event)
  }

  @HostListener('click', ['$event'])
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.initializeLocation(event)
  }

  @HostListener('touchend')
  @HostListener('touchcancel')
  @HostListener('mouseleave')
  onMouseLeave() {
    this.isBeingHovered.set(false)
  }

  // Helpers
  isRightHalf() {
    return this.tooltipPos.x > (this.screenWidth / 2)
  }

  get XPos() {
    return this.tooltipPos.x
  }

  // For the hover tooltip
  initializeLocation(event: MouseEvent) {
    const screenWidth = this.#window.innerWidth
    const cursorX = event.pageX
    const halfWidth = screenWidth / 2

    if (cursorX < halfWidth) {
      // Cursor is on the left half of the screen
      this.tooltipPos = {
        x: event.pageX + 10 - this.#window.scrollX,
        y: event.pageY + 10 - this.#window.scrollY
      };
    } else {
      // Cursor is on the right half of the screen
      this.tooltipPos = {
        x: event.pageX + 10 - this.#window.scrollX,
        y: event.pageY + 10 - this.#window.scrollY
      };
    }
  }

  formatLocalTime(unixTime: number): string {
    return new Date(unixTime * 1000).toLocaleString([], {
      hour: '2-digit', minute: '2-digit', second: this.showSecond() ? '2-digit' : undefined,
      day: 'numeric', year: 'numeric', month: 'numeric'
    });
  }

  hasEvent(mayor: MayorData): boolean {
    return mayor.event !== undefined;
  }

  whenIsMayorComparedToNow(mayor: MayorData): TimeStringTuple {
    const diffStart = mayor.startTime - this.now()
    const diffEnd = mayor.endTime - this.now()

    if (diffStart > 0) {
      return ['future', this.formatTimeDifference(diffStart)]
    } else if (diffEnd > 0) {
      return ['present', this.formatTimeDifference(diffEnd)]
    } else {
      return ['past', this.formatTimeDifference(-diffEnd)]
    }
  }

  private formatTimeDifference(timeInSec: number, formatDays = true): string {
    const days = Math.floor(timeInSec / (HOUR * 24));
    const hoursWithoutDay = Math.floor(timeInSec / HOUR);
    const hoursWithDay = hoursWithoutDay % 24;
    const minutes = Math.floor((timeInSec % HOUR) / MINUTE);
    const seconds = Math.floor((timeInSec % HOUR) % MINUTE);

    let returnString = ''

    if (formatDays) returnString += `${days}d ${hoursWithDay}h ${minutes}m`
    else returnString += `${hoursWithoutDay}h ${minutes}m`

    if (this.showSecond()) returnString += ` ${seconds}s`

    return returnString
  }

  protected readonly Date = Date;
}
