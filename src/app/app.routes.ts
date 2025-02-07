import {Routes} from '@angular/router';
import {TerminalComponent} from './terminal/terminal.component';
import {HomeComponent} from './home/home.component';
import {CalculatorComponent} from './calculator/calculator.component';
import {LiveMpComponent} from './live-mp/live-mp.component';
import {TodoComponent} from "./todo/todo.component";
import {AboutComponent} from "./about/about.component";
import {PaneGameComponent} from "./terminal/panegame/panegame.component";
import {NumbergameComponent} from "./terminal/numbergame/numbergame.component";
import {ColorerComponent} from "./terminal/colorer/colorer.component";
import {FruitDiggingComponent} from "./fruit-digging/fruit-digging.component";
import {MayorCycleComponent} from "./mayor/mayor-cycle/mayor-cycle.component";
import {ThankYouComponent} from "./mayor/thank-you/thank-you.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Main Menu'
  },
  {
    path: 'terminal',
    title: 'Floor 7 Terminals',
    children: [
      {
        path: 'panes',
        component: PaneGameComponent
      },
      {
        path: 'numbers',
        component: NumbergameComponent
      },
      {
        path: 'colors',
        component: ColorerComponent
      },
      {
        path: '**',
        component: TerminalComponent
      }
    ]
  },
  {
    path: 'cowvsele',
    component: CalculatorComponent,
    title: 'Calculator'
  },
  {
    path: 'livemp',
    component: LiveMpComponent,
    title: 'Live Magical Power Display'
  },
  {
    path: 'todo',
    component: TodoComponent,
    title: 'To Do List'
  },
  {
    path: 'about',
    component: AboutComponent,
    title: 'About'
  },
  {
    path: 'fruit',
    component: FruitDiggingComponent,
    title: 'Fruit Digging Game'
  },
  {
    path: 'jerry',
    component: MayorCycleComponent,
    title: 'Preview Jerry Feb 2025',
    data: {
      start: 1738941300,
      month: 'February 2025',
      order: ['Finnegan', 'Cole', '??', 'Marina', '??', '??']
    }
  },
  /*
  {
    path: 'hotm',
    component: HotmComponent,
    title: 'Heart of the Mountain Sim'
  },
  */
  {
    path: 'archive',
    children: [
      {
        path: 'jerry',
        children: [
          {
            path: 'oct24',
            component: MayorCycleComponent,
            title: 'Oct 24 Jerry Cycle',
            data: {
              start: 1728227700,
              month: 'October 2024',
              order: ['Finnegan', 'Marina', 'Paul', 'Cole', 'Aatrox', 'Diana']
            }
          }
        ]
      },
      {
        path: '**',
        component: ThankYouComponent,
        title: 'Jerry is over!'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];