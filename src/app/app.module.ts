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
import { ColorerComponent } from './terminal/colorer/colorer.component';
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';
import { HttpClient, provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    TerminalComponent,
    PaneComponent,
    PaneGameComponent,
    NumbergameComponent,
    NavbarComponent,
    HomeComponent,
    ColorerComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MarkdownModule.forRoot({ loader: HttpClient })
  ],
  providers: [
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
