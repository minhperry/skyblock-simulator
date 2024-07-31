import { Component } from '@angular/core';

interface Link {
  path: string;
  label: string;
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
  ]
}
