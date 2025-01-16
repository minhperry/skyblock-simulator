import {Component} from '@angular/core';
import {NavbarComponent} from "./navbar/navbar.component";
import {RouterOutlet} from "@angular/router";

@Component({
    selector: 'sb-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [
        NavbarComponent,
        RouterOutlet
    ]
})
export class AppComponent {
}
