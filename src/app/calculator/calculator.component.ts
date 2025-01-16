import { Component } from '@angular/core';
import {FarmingFortuneComponent} from "./farming-fortune/farming-fortune.component";

@Component({
    selector: 'sb-calculator',
    templateUrl: './calculator.component.html',
    imports: [
        FarmingFortuneComponent
    ],
    styleUrl: './calculator.component.scss'
})
export class CalculatorComponent {

}
