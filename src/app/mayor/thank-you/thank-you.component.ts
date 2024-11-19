import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {DAY, HOUR, MINUTE} from "../../../interfaces/jerry";
import {Utils} from "../../../services/utils"

@Component({
    selector: 'app-thank-you',
    templateUrl: './thank-you.component.html',
    styleUrl: './thank-you.component.scss'
})
export class ThankYouComponent implements OnInit, OnDestroy {
    nextJerry = 1739387700
    current: number = 0
    private interval: any;

    constructor(@Inject(PLATFORM_ID) private platform: Object) {
    }

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
        Utils.doIfBrowser(this.platform, () => {
            this.interval = setInterval(() => this.updateTime(), 1000)
        })
    }

    ngOnDestroy(): void {
        if (this.interval) {
            clearInterval(this.interval)
        }
    }

    private updateTime(): void {
        this.current = Math.floor(Date.now() / 1000);
    }
}
