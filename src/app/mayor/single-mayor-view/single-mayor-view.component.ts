import {
  Component,
  HostListener,
  input,
  signal,
  Inject
} from '@angular/core';
import {Mayor} from '../../../interfaces/jerry';
import {DOCUMENT, NgStyle} from '@angular/common';

@Component({
  selector: 'sb-single-mayor-view',
  imports: [
    NgStyle
  ],
  templateUrl: './single-mayor-view.component.html',
  styleUrl: './single-mayor-view.component.scss'
})
export class SingleMayorViewComponent {
  // Inputs
  mayor = input.required<Mayor>()
  isActive = input<boolean>(false)

  // Internal states
  isBeingHovered = signal(false)
  tooltipPos = {x: 0, y: 0}

  // DOM objects
  #window: Window
  screenWidth: number

  constructor(@Inject(DOCUMENT) private doc: Document) {
    this.#window = this.doc.defaultView!
    this.screenWidth = this.#window.innerWidth
  }


  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event: MouseEvent) {
    this.isBeingHovered.set(true)
    this.initializeLocation(event)
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.initializeLocation(event)
  }

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
}
