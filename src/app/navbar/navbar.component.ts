import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Nullable} from "../../interfaces/types";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    imports: [
        RouterLink
    ],
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
}
