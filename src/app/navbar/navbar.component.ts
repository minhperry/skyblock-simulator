import {Component, OnInit} from '@angular/core';
import {MenuItem, PrimeTemplate} from 'primeng/api';
import {Menubar} from 'primeng/menubar';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'sb-navbar',
  templateUrl: './navbar.component.html',
  imports: [
    Menubar,
    PrimeTemplate,
    RouterLink
  ],
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
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
          {label: 'Heart of the Mountain', routerLink: '/hotm'}
        ]
      },
      {
        label: 'Tools',
        icon: 'bi bi-tools',
        items: [
          {label: 'To-do', routerLink: '/todo'},
          {separator: true},
          {
            label: 'Jerry Calendar',
            items: [
              {label: 'Jerry Jun25', routerLink: '/jerry'},
              {label: 'Jerry Feb25 Archive', routerLink: '/archive/jerry/feb25'},
              {label: 'Jerry Oct24 Archive', routerLink: '/archive/jerry/oct24'},
            ]
          }
        ]
      },
      {
        label: 'Not Coming Soon',
        icon: 'bi bi-star',
        items: [
          {label: 'More terminals', disabled: true},
          {label: 'Dungeon chest simulator', disabled: true},
          {label: 'Experiments', disabled: true}
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
      }
    ];
  }
}
