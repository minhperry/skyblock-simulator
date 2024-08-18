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
import { MarkdownModule } from 'ngx-markdown';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StartswithComponent } from './startswith/startswith.component';
import { CertaincolorComponent } from './certaincolor/certaincolor.component';

@NgModule({
  declarations: [
    AppComponent,
    TerminalComponent,
    PaneComponent,
    PaneGameComponent,
    NumbergameComponent,
    NavbarComponent,
    HomeComponent,
    ColorerComponent,
    StartswithComponent,
    CertaincolorComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
    MatSliderModule,
    FormsModule,
    ReactiveFormsModule 
  ],
  providers: [
    provideHttpClient(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
