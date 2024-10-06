import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {TerminalComponent} from './terminal/terminal.component';
import {PaneComponent} from './terminal/pane/pane.component';
import {PaneGameComponent} from './terminal/panegame/panegame.component';
import {NumbergameComponent} from './terminal/numbergame/numbergame.component';
import {NavbarComponent} from './navbar/navbar.component';
import {HomeComponent} from './home/home.component';
import {ColorerComponent} from './terminal/colorer/colorer.component';
import {MarkdownModule} from 'ngx-markdown';
import {HttpClient, provideHttpClient} from '@angular/common/http';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {MatSliderModule} from '@angular/material/slider';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StartswithComponent} from './startswith/startswith.component';
import {CertaincolorComponent} from './certaincolor/certaincolor.component';
import {CalculatorComponent} from './calculator/calculator.component';
import {FarmingFortuneComponent} from './calculator/farming-fortune/farming-fortune.component';
import {MatIconModule} from '@angular/material/icon';
import {StrengthComponent} from './calculator/strength.comp';
import {FarmingFortunesComponent} from './calculator/ff.comp';
import {TextableSliderComponent} from './calculator/farming-fortune/reusables/textable-slider.component';
import {TextableCheckboxComponent} from './calculator/farming-fortune/reusables/textable-checkbox.component';
import {RadioComponent} from './calculator/farming-fortune/reusables/radio.component';
import {LiveMpComponent} from './live-mp/live-mp.component';
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {TodoComponent} from './todo/todo.component';
import {TodoItemComponent} from './todo/todo-item/todo-item.component';
import {AboutComponent} from './about/about.component';
import {FruitDiggingComponent} from './fruit-digging/fruit-digging.component';
import {RollingNumberComponent} from './animation/rolling-number/rolling-number.component';
import {TestComponent} from './test/test.component';
import {MayorCycleComponent} from './mayor/mayor-cycle/mayor-cycle.component';
import {NgOptimizedImage} from "@angular/common";

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
    CertaincolorComponent,
    CalculatorComponent,
    FarmingFortuneComponent,
    StrengthComponent,
    FarmingFortunesComponent,
    TextableSliderComponent,
    TextableCheckboxComponent,
    RadioComponent,
    LiveMpComponent,
    TodoComponent,
    TodoItemComponent,
    AboutComponent,
    FruitDiggingComponent,
    RollingNumberComponent,
      TestComponent,
      MayorCycleComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MarkdownModule.forRoot({loader: HttpClient}),
        MatSliderModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatTableModule,
        NgOptimizedImage
    ],
  providers: [
    provideHttpClient(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
