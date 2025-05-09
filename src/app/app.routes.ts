import {Routes} from '@angular/router';
import {TerminalComponent} from './terminal/terminal.component';
import {HomeComponent} from './home/home.component';
import {LiveMpComponent} from './live-mp/live-mp.component';
import {TodoComponent} from "./todo/todo.component";
import {AboutComponent} from "./about/about.component";
import {PaneGameComponent} from "./terminal/panegame/panegame.component";
import {NumbergameComponent} from "./terminal/numbergame/numbergame.component";
import {ColorerComponent} from "./terminal/colorer/colorer.component";
import {FruitDiggingComponent} from "./fruit-digging/fruit-digging.component";
import {MayorCycleComponent} from "./mayor/mayor-cycle/mayor-cycle.component";
import {FarmingFortuneComponent} from './calculator/farming-fortune/farming-fortune.component';
import {NotFoundComponent} from './not-found/not-found.component';

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
    component: FarmingFortuneComponent,
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
    /*
    component: MayorCycleComponent,
    title: 'Jerry June 2025',
    data: {
      start: 1749654900,
      month: 'June 2025',
      order: ['??', '??', '??', '??', '??', '??']
    }
    */
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
      },
      {
        path: 'feb25',
        component: MayorCycleComponent,
        title: 'Feb 25 Jerry Cycle',
        data: {
          start: 1738941300,
          month: 'February 2025',
          order: ['Finnegan', 'Cole', 'Marina', 'Diana', 'Aatrox', 'Paul']
        }
      },
      {
        path: '**',
        component: MayorCycleComponent,
        title: 'Jun 25 Jerry Cycle',
        data: {
          start: 1749654900,
          month: 'June 2025',
          order: ['??', '??', '??', '??', '??', '??']
        }
      }
    ]
  },
  /*
  {
    path: 'hotm',
    component: HotmComponent,
    title: 'Heart of the Mountain Sim'
  },
  */
  {
    path: '**',
    component: NotFoundComponent,
    title: '404 Not Found',
  }
];