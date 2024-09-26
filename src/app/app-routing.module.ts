import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TerminalComponent} from './terminal/terminal.component';
import {HomeComponent} from './home/home.component';
import {CalculatorComponent} from './calculator/calculator.component';
import {LiveMpComponent} from './live-mp/live-mp.component';
import {TodoComponent} from "./todo/todo.component";
import {AboutComponent} from "./about/about.component";
import {PaneGameComponent} from "./terminal/panegame/panegame.component";
import {NumbergameComponent} from "./terminal/numbergame/numbergame.component";
import {CertaincolorComponent} from "./certaincolor/certaincolor.component";
import {ColorerComponent} from "./terminal/colorer/colorer.component";

const routes: Routes = [
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
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
