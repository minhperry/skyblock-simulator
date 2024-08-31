import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TerminalComponent } from './terminal/terminal.component';
import { HomeComponent } from './home/home.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { LiveMpComponent } from './live-mp/live-mp.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Main Menu'
  },
  {
    path: 'terminal',
    component: TerminalComponent,
    title: 'Floor 7 Terminals'
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
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
