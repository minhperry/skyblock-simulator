import {Component, OnInit} from '@angular/core';
import {DAY, HOUR, Mayor, MINUTE} from "../../../interfaces/jerry";

@Component({
  selector: 'app-mayor-cycle',
  templateUrl: './mayor-cycle.component.html',
  styleUrl: './mayor-cycle.component.scss'
})
export class MayorCycleComponent implements OnInit{
    cycleStartTime: number = 1728227700
    jerryEndTime = this.cycleStartTime + 5 * DAY + 4 * HOUR

    currentTime: number = Math.floor(Date.now() / 1000);
    eventOffset = 15 * MINUTE
    timezoneOffset = 0

    mayors: Mayor[] = [
        { name: 'Finnegan', imageSrc: '/mayor/finnegan.png' },
        {name: 'Marina', imageSrc: '/mayor/marina.png', eventDuration: 60, eventMessage: 'Fishing Festival!'},
        { name: 'Mayor 3' },
        {name: 'Cole', imageSrc: '/mayor/cole.png', eventDuration: 140, eventMessage: 'Mining Fiesta!'},
        { name: 'Mayor 5' },
        { name: 'Mayor 6' },
    ];

    loadTimezoneOffset(): void {
        const savedOffset = localStorage.getItem('timezoneOffset');
        if (savedOffset !== null) {
            this.timezoneOffset = +savedOffset * HOUR;
        }
    }

    saveTimezoneOffset(event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = input.value;
        this.timezoneOffset = +value * HOUR;
        localStorage.setItem('timezoneOffset', value);
    }

    getHourText() {
        const offset = this.timezoneOffset / HOUR;
        const absTime = Math.abs(offset);
        const hrText = absTime === 1 ? 'hour' : 'hours'
        return `${offset} ${hrText}`;
    }

    ngOnInit(): void {
        this.updateTime();
        this.loadTimezoneOffset()
        setInterval(() => this.updateTime(), 1000);
    }

    getLocalTime(unixTime: number): string {
        const adjustedTime = unixTime + this.timezoneOffset;
        return new Date(adjustedTime * 1000).toLocaleString([], {
            hour: '2-digit', minute: '2-digit',
            day: 'numeric', year: 'numeric', month: "numeric"
        });
    }

    getMayorStartTime(index: number): number {
        return this.cycleStartTime + (index * 6 * HOUR);
    }

    getMayorEventTime(index: number): number {
        return this.getMayorStartTime(index) + this.eventOffset;
    }

    updateTime(): void {
        this.currentTime = Math.floor(Date.now() / 1000);
    }

    isMayorActive(index: number): boolean {
        const startTime = this.getMayorStartTime(index);
        const endTime = startTime + (6 * HOUR); // Each mayor stays for 6 hours
        return this.currentTime >= startTime && this.currentTime < endTime;
    }

    isEventActive(mayor: Mayor, index: number): boolean {
        const eventStartTime = this.getMayorEventTime(index);
        console.log(eventStartTime);
        if (mayor.eventDuration) {
            return this.currentTime >= eventStartTime && this.currentTime < eventStartTime + (mayor.eventDuration * MINUTE);
        }
        return false;
    }

    showPerks(event: MouseEvent, mayor: Mayor): void {
        const tooltip = document.getElementById('perks-popup');
        if (tooltip) {
            const tooltipContent = document.getElementById('perks-content');
            if (tooltipContent) {
                tooltipContent.innerText = `${mayor.name}'s Perks`; // Replace with dynamic perks content
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
            tooltip.style.left = `${event.pageX + 5}px`; // Offset tooltip slightly to the right
            tooltip.style.top = `${event.pageY + 10}px`; // Offset tooltip slightly down
        }
    }

    protected readonly HOUR = HOUR;
}
