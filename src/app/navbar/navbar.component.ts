import { Component } from '@angular/core';

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
    { path: '/', label: 'Home' },
    { path: '/terminal', label: 'Terminal' },
    { path: '/cowvsele', label: 'Farming' },
    { path: '/livemp', label: 'Live MP' },
    { path: '/todo', label: 'To Do'}
  ]

  handle(link: Link) {
    return link.comingSoon ? `<s>${link.label}</s>` : link.label;
  }
}
