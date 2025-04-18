import {Component, inject, resource} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {injectQuery} from '@tanstack/angular-query-experimental';
import {catchError, firstValueFrom, lastValueFrom, throwError} from 'rxjs';
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs';

interface ChangelogEntry {
  component: string;
  description: string;
}

interface ChangelogPatch {
  version: string;
  entries: ChangelogEntry[];
}

interface ChangelogMinorVersion {
  version: string;
  patches: ChangelogPatch[];
}

@Component({
  selector: 'sb-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [TabPanel, Tabs, TabList, Tab, TabPanel, TabPanels]
})
export class HomeComponent {
  changelog: ChangelogMinorVersion[] = [];

  private http = inject(HttpClient);

  changelogRes = resource({
    loader: () => this.httpGet
  })

  private httpGet = firstValueFrom(this.http.get<ChangelogMinorVersion[]>('/changelog.json'))

  changelogQuery = injectQuery(() => ({
    queryKey: ['changelog'],
    queryFn: () => firstValueFrom(
      this.http.get<ChangelogMinorVersion[]>('/changelog.json').pipe(
        catchError(err => {
          return throwError(() => err)
        })
      )), // or lastValueFrom if you want to wait for the last value
  }))
}
