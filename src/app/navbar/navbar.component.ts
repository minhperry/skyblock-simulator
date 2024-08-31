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
    { path: '/cowvsele', label: 'Pet Compare' }, 
    { path: '/livemp', label: 'Live MP Display' },
    { path: '/dunngeon', label: 'Dungeon', comingSoon: true },
    { path: '/experiment', label: 'Experiment', comingSoon: true },
  ]

  handle(link: Link) {
    return link.comingSoon ? `<s>${link.label}</s>` : link.label;
  }
}
