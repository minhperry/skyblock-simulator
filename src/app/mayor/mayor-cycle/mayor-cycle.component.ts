import {Component, OnInit} from '@angular/core';
import {DAY, HOUR, Mayor, MINUTE} from "../../../interfaces/jerry";

@Component({
  selector: 'app-mayor-cycle',
  templateUrl: './mayor-cycle.component.html',
  styleUrl: './mayor-cycle.component.scss'
})
export class MayorCycleComponent implements OnInit{
    cycleStartTime: number = 1728220500;
    jerryEndTime = this.cycleStartTime + 5 * DAY + 4 * HOUR

    currentTime: number = Math.floor(Date.now() / 1000);
    eventOffset = 15 * MINUTE

    mayors: Mayor[] = [
        { name: 'Finnegan', imageSrc: '/mayor/finnegan.png' },
        { name: 'Marina', imageSrc: '/mayor/marina.png', eventDuration: HOUR },
        { name: 'Mayor 3' },
        { name: 'Cole', imageSrc: '/mayor/cole.png', eventDuration: 140 },
        { name: 'Mayor 5' },
        { name: 'Mayor 6' },
    ];

    ngOnInit(): void {
        this.updateTime();
        setInterval(() => this.updateTime(), 1000); // Update every second
    }

    getLocalTime(unixTime: number): string {
        const localDate = new Date(unixTime * 1000);
        const offset = localDate.getTimezoneOffset() * MINUTE; // Offset in seconds
        const localTime = unixTime - offset;
        return new Date(localTime * 1000).toLocaleString();
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
            tooltip.style.left = `${event.pageX}px`;
            tooltip.style.top = `${event.pageY - 50}px`;
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
}
