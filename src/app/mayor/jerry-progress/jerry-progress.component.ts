import {Component, computed, inject, input, OnInit} from '@angular/core';
import {ProgressBar} from 'primeng/progressbar';
import {NgClass, NgStyle} from '@angular/common';
import {DAY, HOUR, MayorData} from '../../../interfaces/jerry';
import {MayorCycleComponent} from '../mayor-cycle/mayor-cycle.component';

interface Marker {
  percentage: number,
  text: string
}

interface EventMarker {
  start: Marker,
  end: Marker,
  type: 'mining' | 'fishing'
}

@Component({
  selector: 'sb-jerry-progress',
  imports: [
    ProgressBar,
    NgStyle,
    NgClass
  ],
  templateUrl: './jerry-progress.component.html',
  styleUrl: './jerry-progress.component.scss'
})
export class JerryProgressComponent implements OnInit {
  mayors = input<MayorData[]>([])
  mayorMarkers: Marker[] = []
  eventMarkers: EventMarker[] = []

  startTime = input<number>(0)
  private endTime!: number

  // Inject from the parent component
  parent = inject(MayorCycleComponent)
  now = this.parent.nowSignal()

  nowPercentage = computed(() => {
    const percentage = this.relativePercentage(this.now())
    return Math.min(Math.max(percentage, 0), 100)
  })

  ngOnInit() {
    this.endTime = this.startTime() + 5 * DAY + 4 * HOUR
    this.mayorMarkers = this.mayors().map(md => {
      const percentage = this.relativePercentage(md.startTime)
      const text = `${md.mayor.name}`
      return {percentage, text}
    })
    this.mayors().forEach(md => {
      if (md.event) {
        const [start, end] = [md.event.start, md.event.end] as const;
        const startPercentage = this.relativePercentage(start)
        const endPercentage = this.relativePercentage(end)
        const type = `${md.event.eventName}` === 'Mining Fiesta' ? 'mining' : 'fishing'
        this.eventMarkers.push({
          start: {percentage: startPercentage, text: '>'},
          end: {percentage: endPercentage, text: '<'},
          type: type
        })
      }
    })
  }

  markers = [20, 27, 33, 50, 66, 75]

  private relativePercentage(time: number) {
    return (time - this.startTime()) / (this.endTime - this.startTime()) * 100
  }
}
