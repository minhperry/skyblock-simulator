import {Component} from '@angular/core';
import {Nullable} from "../../interfaces/todo";

interface Link {
    path: string;
    label: string;
    comingSoon?: boolean;
}

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
    links: Link[] = [
        {path: '/', label: 'Home'},
        {path: '/terminal', label: 'Terminal'},
        {path: '/cowvsele', label: 'Farming'},
        {path: '/livemp', label: 'Live MP'},
        {path: '/todo', label: 'To Do'}
    ]
    searchText: Nullable<string> = null;

    doWikiSearch() {
        window.open('https://wiki.hypixel.net/index.php?search=' + this.searchText + '&title=Special%3ASearch&fulltext=search')
    }

}
