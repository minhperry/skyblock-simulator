import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration, BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { NgOptimizedImage } from '@angular/common';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule, 
        // MarkdownModule.forRoot({loader: HttpClient}),
        MatSliderModule, FormsModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatTableModule, NgOptimizedImage),
        provideHttpClient(withFetch()),
        provideAnimationsAsync(),
        provideClientHydration()
    ]
})
  .catch(err => console.error(err));
