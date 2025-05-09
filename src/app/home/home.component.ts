import {Component, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs';
import {Tag} from 'primeng/tag';
import {injectQuery} from '@tanstack/angular-query-experimental';
import {FakeDelayService} from '../../services/fake-delay-service.service';

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

interface FeatureBox {
  title: string;
  description: string[];
}

@Component({
  selector: 'sb-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [TabPanel, Tabs, TabList, Tab, TabPanel, TabPanels, Tag],
})
export class HomeComponent {
  private http = inject(HttpClient);
  #fds = inject(FakeDelayService)

  changelogQuery = injectQuery(() => ({
    queryKey: ['changelog'],
    queryFn: () => {
      // Delay the first load of changelog.json by 750ms to 2.5s
      this.#fds.delayOnceRandom('changelog', 750, 2500).then()

      return firstValueFrom(this.http.get<ChangelogMinorVersion[]>('/changelog.json'))
    }
  }))

  features: FeatureBox[] = [
    {
      title: 'Games',
      description: [
        'Floor 7 terminals simulation',
        'Fruit digging simulation',
        'CS!Dungeon chest simulator',
        'CS!More terminals',
        'CS!Experiments simulator',
      ]
    },
    {
      title: 'Calculators',
      description: [
        'Live Magical Power calculator',
        'Comparing your Mooshroom Cow and Elephant',
        'CS!Heart of the Mountain calculator',
      ]
    },
    {
      title: 'Calendars',
      description: [
        'Jerry Calendar',
        'CS!Skyblock Calendar'
      ]
    }
  ]
}
