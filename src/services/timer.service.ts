import { Injectable, Inject } from '@angular/core';
import {NullableInterval} from "./utils";

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private timer = 0;
  private intervalId: NullableInterval = null;
  private readonly incrementPerMs: number;

  constructor(@Inject('timeInMs') timeInMs: number) { 
    this.incrementPerMs = timeInMs
  }

  start() {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.timer += this.incrementPerMs / 1000;
      }, this.incrementPerMs);
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  restart() {
    this.stop()
    this.timer = 0
  }

  time(): number {
    return this.timer
  }
}
