import { Component } from '@angular/core';
import {PaneGameComponent} from "./panegame/panegame.component";
import {NumbergameComponent} from "./numbergame/numbergame.component";
import {ColorerComponent} from "./colorer/colorer.component";

@Component({
    selector: 'terminal',
    templateUrl: './terminal.component.html',
    imports: [
        PaneGameComponent,
        NumbergameComponent,
        ColorerComponent
    ],
    styleUrl: './terminal.component.css'
})
export class TerminalComponent {
}
