import {Component} from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {
    currentViewCount: number = 17384;
    toggle = false
    time: number = 200;
    i: number = 0

    constructor() {
        // Simulate value updates every few seconds
        setInterval(() => {
            if (this.toggle)
                this.currentViewCount = this.getRandomViewCount(); // Update with a random count
        }, 1000); // Update every 5 seconds
    }

    add(int: number) {
        this.currentViewCount += int
    }

    subtract(int: number) {
        this.currentViewCount -= int
    }

    private getRandomViewCount(): number {
        // Generate a random view count (you can customize this logic)
        return Math.floor(Math.random() * 1000000);
    }
}
