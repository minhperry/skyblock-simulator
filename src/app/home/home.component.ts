import {Component, inject, resource} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, firstValueFrom, throwError} from 'rxjs';
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs';
import {Tag} from 'primeng/tag';

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
  imports: [TabPanel, Tabs, TabList, Tab, TabPanel, TabPanels, Tag]
})
export class HomeComponent {
  private http = inject(HttpClient);

  changelogRes = resource({
    loader: () => firstValueFrom(
      this.http.get<ChangelogMinorVersion[]>('/changelog.json').pipe(
        catchError(err => {
          return throwError(() => err)
        })
      ))
  })

  /* Keep this for archive purposes
  changelogQuery = injectQuery(() => ({
    queryKey: ['changelog'],
    queryFn: () => firstValueFrom(
      this.http.get<ChangelogMinorVersion[]>('/changelog.json').pipe(
        catchError(err => {
          return throwError(() => err)
        })
      )), // or lastValueFrom if you want to wait for the last value
  }))
  */
}
