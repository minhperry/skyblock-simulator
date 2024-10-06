import {Component, OnInit} from '@angular/core';
import {DAY, HOUR, Mayor, MINUTE} from "../../../interfaces/jerry";

@Component({
  selector: 'app-mayor-cycle',
  templateUrl: './mayor-cycle.component.html',
  styleUrl: './mayor-cycle.component.scss'
})
export class MayorCycleComponent implements OnInit{
    absoluteStartTime: number = 1728227700
    jerryEndTime = this.absoluteStartTime + 5 * DAY + 4 * HOUR

    currentTime: number = Math.floor(Date.now() / 1000);
    eventOffset = 15 * MINUTE

    mayors: Mayor[] = [
        { name: 'Finnegan', imageSrc: '/mayor/finnegan.png' },
        {name: 'Marina', imageSrc: '/mayor/marina.png', eventDuration: 60, eventMessage: 'Fishing Festival!'},
        {name: '#3'},
        {name: 'Cole', imageSrc: '/mayor/cole.png', eventDuration: 140, eventMessage: 'Mining Fiesta!'},
        {name: '#5'},
        {name: '#6'},
        {name: 'Finnegan', imageSrc: '/mayor/finnegan.png'},
        {name: 'Marina', imageSrc: '/mayor/marina.png', eventDuration: 60, eventMessage: 'Fishing Festival!'},
        {name: '#3'},
        {name: 'Cole', imageSrc: '/mayor/cole.png', eventDuration: 140, eventMessage: 'Mining Fiesta!'},
        {name: '#5'},
        {name: '#6'},
        {name: 'Finnegan', imageSrc: '/mayor/finnegan.png'},
        {name: 'Marina', imageSrc: '/mayor/marina.png', eventDuration: 60, eventMessage: 'Fishing Festival!'},
        {name: '#3'},
        {name: 'Cole', imageSrc: '/mayor/cole.png', eventDuration: 140, eventMessage: 'Mining Fiesta!'},
        {name: '#5'},
        {name: '#6'},
        {name: 'Finnegan', imageSrc: '/mayor/finnegan.png'},
        {name: 'Marina', imageSrc: '/mayor/marina.png', eventDuration: 60, eventMessage: 'Fishing Festival!'},
        {name: '#3'},
    ];


    ngOnInit(): void {
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }

    getLocalTime(unixTime: number): string {
        return new Date(unixTime * 1000).toLocaleString([], {
            hour: '2-digit', minute: '2-digit',
            day: 'numeric', year: 'numeric', month: "numeric"
        });
    }

    getMayorStartTime(index: number): number {
        return this.absoluteStartTime + (index * 6 * HOUR);
    }

    getMayorEventTime(index: number): number {
        return this.getMayorStartTime(index) + this.eventOffset;
    }

    updateTime(): void {
        this.currentTime = Math.floor(Date.now() / 1000);
    }

    isMayorActive(index: number): boolean {
        const startTime = this.getMayorStartTime(index);
        const endTime = startTime + (6 * HOUR);
        return this.currentTime >= startTime && this.currentTime < endTime && this.currentTime < this.jerryEndTime;
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
                tooltipContent.innerText = `${mayor.name}'s Perks`;
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
            tooltip.style.left = `${event.pageX + 5}px`;
            tooltip.style.top = `${event.pageY + 10}px`;
        }
    }
}
