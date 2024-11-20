import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import {provideClientHydration} from "@angular/platform-browser";

@NgModule({
  imports: [
    ServerModule,
],
  bootstrap: [],
  providers: [
    provideClientHydration()
  ]
})
export class AppServerModule {}
