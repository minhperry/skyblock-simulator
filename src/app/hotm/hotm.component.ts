import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {HotmBackendService} from "../../services/hotm-backend.service";
import {Perk} from "../../interfaces/hotm";

@Component({
  selector: 'app-hotm',
  templateUrl: './hotm.component.html',
  styleUrl: './hotm.component.scss'
})
export class HotmComponent implements OnInit {
  grid: Perk[][] = []

  constructor(
    // private hotm: HotmBackendService
    @Inject(PLATFORM_ID) private platform: Object,
  ) {
  }

  ngOnInit() {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 7; j++) {
        // this.grid[i][j] = 'a';
      }
    }
  }
}
