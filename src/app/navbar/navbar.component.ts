import {Component} from '@angular/core';
import {Nullable} from "../../interfaces/todo";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
    standalone: false
})
export class NavbarComponent {
    searchText: Nullable<string> = null;

    doWikiSearch() {
        window.open('https://wiki.hypixel.net/index.php?search=' + this.searchText + '&title=Special%3ASearch&fulltext=search')
    }

}
