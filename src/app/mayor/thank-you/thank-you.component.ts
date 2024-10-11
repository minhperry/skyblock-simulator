import {Component, OnInit} from '@angular/core';
import {DAY, HOUR, MINUTE} from "../../../interfaces/jerry";

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrl: './thank-you.component.scss'
})
export class ThankYouComponent implements OnInit {
    // lastJerry = 1728227700
    nextJerry = 1739387700
    current: number = 0

    calcDiff() {
        let diff = - this.current + this.nextJerry
        let day = Math.floor(diff / DAY)
        diff %= DAY
        let hour = Math.floor(diff / HOUR)
        diff %= HOUR
        let minute = Math.floor(diff / MINUTE)
        let second = diff % MINUTE
        return `${day}d ${hour}h ${minute}m ${second}s`
    }

    formatNextJerry() {
        return new Date(this.nextJerry * 1000).toLocaleString([], {
            hour: '2-digit', minute: '2-digit',
            day: 'numeric', year: 'numeric', month: "numeric"
        });
    }

    ngOnInit() {
        this.updateTime()
        setInterval(() => this.updateTime(), 1000)
    }

    private updateTime(): void {
        this.current = Math.floor(Date.now() / 1000);
    }
}
