import {Component, OnInit} from '@angular/core';
import {DAY, HOUR, Mayor, mayorData, MINUTE} from "../../../interfaces/jerry";

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
    cycleLength = 6 * HOUR

    mayors: Mayor[] = [];
    private mayorNames = ['Finnegan', 'Marina', '#3', 'Cole', '#5', '#6']
    private fullMayors: string[] = []

    ngOnInit(): void {
        this.updateTime();
        this.extendMayorNamesUntilJerryEnd()
        this.mayors = this.fullMayors.map(name => {
            const data = mayorData[name];
            return {
                name: name,
                imageSrc: data?.imageSrc,
                eventDuration: data?.eventDuration,
                eventMessage: data?.eventMessage,
                perks: data?.perks
            } as Mayor;
        })
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

    extendMayorNamesUntilJerryEnd(): void {
        // Calculate the number of 6-hour slots between cycleStartTime and jerryEndTime
        const totalDuration = this.jerryEndTime - this.absoluteStartTime;
        const totalSlots = Math.floor(totalDuration / this.cycleLength);

        // Repeat the baseMayorNames array until the total number of slots is filled
        for (let i = 0; i <= totalSlots; i++) {
            const mayorIndex = i % this.mayorNames.length;
            this.fullMayors.push(this.mayorNames[mayorIndex]);
        }
    }

    showPerks(event: MouseEvent, mayor: Mayor): void {
        const tooltip = document.getElementById('perks-popup');
        if (tooltip) {
            const tooltipContent = document.getElementById('perks-content');
            if (tooltipContent) {
                //const perksList = mayor.perks ? mayor.perks.map(perk => `<strong>${perk.name}</strong>: ${perk.desc}`).join('<br>') : 'No perks available.';
                //tooltipContent.innerHTML = `${mayor.name}'s Perks:<br>${perksList}`;
                tooltipContent.innerHTML = mayor.perks?.map(perk =>
                    `<div><b class="mc green">${perk.name}</b><br><p>${perk.desc}</p></div>`
                ).join('') || '';
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
            const screenWidth = window.innerWidth;
            const cursorPositionX = event.pageX;

            const openToLeft = cursorPositionX < screenWidth / 2;

            if (openToLeft) {
                tooltip.classList.add('right');
                tooltip.classList.remove('left');
                tooltip.style.left = `${event.pageX + 10}px`;
                tooltip.style.right = 'auto';
            } else {
                tooltip.classList.add('left');
                tooltip.classList.remove('right');
                tooltip.style.right = `${screenWidth - event.pageX + 10}px`;
                tooltip.style.left = 'auto';
            }

            tooltip.style.top = `${event.pageY + 10}px`;
        }
    }
}
