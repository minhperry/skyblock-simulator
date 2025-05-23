import {Component, inject, signal, WritableSignal} from '@angular/core';
import {formattedPowderString, Position, PowderType} from './hotmData';
import {Nullable} from '../../interfaces/types';
import {NgClass} from '@angular/common';
import {HotmService} from './hotm.service';
import {CardComponent} from './card.component';
import {ColorizePipe} from '../../pipes/colorize.pipe';
import {ParseMCPipe} from '../../pipes/parse-mc.pipe';
import {SafeHtmlPipe} from 'primeng/menu';
import {Button} from 'primeng/button';
import {DialogService} from 'primeng/dynamicdialog';

@Component({
  selector: 'sb-hotm',
  templateUrl: './hotm.component.html',
  styleUrl: './hotm.component.scss',
  imports: [
    NgClass,
    CardComponent,
    ColorizePipe,
    ParseMCPipe,
    SafeHtmlPipe,
    Button
  ],
  providers: [DialogService]
})
export class HotmComponent {
  hotmServ = inject(HotmService);
  selectedPos: WritableSignal<Nullable<Position>> = signal(null)

  dialogServ = inject(DialogService)

  // Click handlers

  onCellClick(x: number, y: number) {
    this.selectedPos.set({x, y});
  }

  protected readonly formattedPowderString = formattedPowderString;
  protected readonly PowderType = PowderType;
}
