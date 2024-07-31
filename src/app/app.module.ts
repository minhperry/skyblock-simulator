import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TerminalComponent } from './terminal/terminal.component';
import { PaneComponent } from './terminal/pane/pane.component';
import { PaneGameComponent } from './terminal/panegame/panegame.component';
import { NumbergameComponent } from './terminal/numbergame/numbergame.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    TerminalComponent,
    PaneComponent,
    PaneGameComponent,
    NumbergameComponent,
    NavbarComponent,
    HomeComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
