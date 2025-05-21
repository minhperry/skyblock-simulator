import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {Menubar} from 'primeng/menubar';

@Component({
  selector: 'sb-navbar',
  templateUrl: './navbar.component.html',
  imports: [
    Menubar
  ],
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'bi bi-house',
        routerLink: '/'
      },
      {
        label: 'Games',
        icon: 'bi bi-joystick',
        items: [
          {
            label: 'Terminals',
            items: [
              {label: 'All terminals', routerLink: '/terminal'},
              {label: 'Panes', routerLink: '/terminal/panes'},
              {label: 'Numbers', routerLink: '/terminal/numbers'},
              {label: 'Colors', routerLink: '/terminal/colors'},
            ]
          },
          {separator: true},
          {label: 'Carnival Fruit Digging', routerLink: '/fruit'}
        ]
      },
      {
        label: 'Calculators',
        icon: 'bi bi-calculator',
        items: [
          {label: 'Magical Power', routerLink: '/livemp'},
          {separator: true},
          {label: 'Moocow vs Elephant', routerLink: '/cowvsele'},
          {separator: true},
          {label: 'Heart of the Mountain', routerLink: '/hotm', disabled: true}
        ]
      },
      {
        label: 'Calendar',
        icon: 'bi bi-calendar',
        items: [
          {label: 'Jerry Jun25', routerLink: '/jerry'},
          {label: 'Jerry Feb25 Archive', routerLink: '/jerry/feb25'},
          {label: 'Jerry Oct24 Archive', routerLink: '/jerry/oct24'},
        ]
      },
      {
        label: 'About',
        icon: 'bi bi-info-circle',
        items: [
          {label: 'About this site', routerLink: '/about'},
          {label: 'Source Code', url: 'https://github.com/minhperry/skyblock-simulator', target: '_blank'},
          {label: 'API docs', routerLink: '/api/v2/docs'}
        ]
      },
      {
        label: 'Legacy',
        icon: 'bi bi-archive',
        items: [
          {label: 'To-do', routerLink: '/todo'}
        ]
      },
      {
        label: 'Support',
        icon: 'bi bi-heart-fill !text-red-500',
        url: 'https://ko-fi.com/minhperry',
      }
    ];
  }
}
