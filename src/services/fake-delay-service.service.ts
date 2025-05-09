import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FakeDelayService {
  private firstLoadMap = new Map<string, boolean>();

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async delayOnce(key: string, ms: number): Promise<void> {
    if (!this.firstLoadMap.get(key)) {
      this.firstLoadMap.set(key, true);
      await this.delay(ms);
    }
  }

  async delayOnceRandom(key: string, min: number, max: number): Promise<void> {
    if (!this.firstLoadMap.get(key)) {
      this.firstLoadMap.set(key, true);
      const delay = Math.floor(Math.random() * (max - min)) + min;
      await this.delay(delay);
    }
  }

  reset(key: string): void {
    this.firstLoadMap.set(key, false);
  }

  clearAll(): void {
    this.firstLoadMap.clear();
  }
}
