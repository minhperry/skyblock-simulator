import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {BrowserModule, provideClientHydration} from '@angular/platform-browser';
import {MarkdownModule} from "ngx-markdown";
import {HttpClient, provideHttpClient, withFetch} from "@angular/common/http";
import {MatSliderModule} from "@angular/material/slider";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {NgOptimizedImage} from "@angular/common";
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeng/themes/aura';
import {provideTanStackQuery, QueryClient} from '@tanstack/angular-query-experimental';
import {definePreset} from '@primeng/themes';
import {provideAnimations} from '@angular/platform-browser/animations';

const PrimeNgPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{sky.50}',
      100: '{sky.100}',
      200: '{sky.200}',
      300: '{sky.300}',
      400: '{sky.400}',
      500: '{sky.500}',
      600: '{sky.600}',
      700: '{sky.700}',
      800: '{sky.800}',
      900: '{sky.900}',
      950: '{sky.950}',
    }
  }
})


export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      BrowserModule,
      MarkdownModule.forRoot({loader: HttpClient}),
      MatSliderModule,
      FormsModule,
      ReactiveFormsModule,
      MatIconModule,
      MatButtonModule,
      MatTableModule,
      NgOptimizedImage
    ),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideAnimations(),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    providePrimeNG({
      theme: {
        preset: PrimeNgPreset
      }
    }),
    provideTanStackQuery(
      new QueryClient()
    )
  ]
};
