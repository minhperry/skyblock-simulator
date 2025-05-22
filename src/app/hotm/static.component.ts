import {Component, inject, input} from '@angular/core';
import {ColorizePipe} from '../../pipes/colorize.pipe';
import {ParseMCPipe} from '../../pipes/parse-mc.pipe';
import {SafeHtmlPipe} from 'primeng/menu';
import {Button} from 'primeng/button';
import {BaseNode, HotmService} from './hotm.service';

@Component({
  selector: 'sb-card-static',
  imports: [
    ColorizePipe,
    ParseMCPipe,
    SafeHtmlPipe,
    Button
  ],
  template: `
    <div class="flex flex-col items-center justify-center">
      <div class="font-semibold text-lg">
        {{ title() }}
      </div>
      <hr class="w-[66%] h-[3px] mx-auto my-2 bg-gray-500/40 border-0 rounded-sm "/>
      <div class="flex flex-row">
        <span [innerHTML]="bodyHtml() | colorize | parse | safeHtml"></span>
      </div>
      <div class="flex justify-center mt-2">
        <p-button severity="primary" (onClick)="enforceOpenRequirement()">
          Open Perk
        </p-button>
      </div>
    </div>
  `
})
export class StaticComponent {
  title = input.required<string>()
  bodyHtml = input.required<string>()
  instance = input.required<BaseNode>()

  enforceOpenRequirement() {
    const reqs = this.instance().requires;
    if (reqs.length === 0 || reqs.every(req => req in this.hotmServ.getOpenIds())) {
      this.instance().onNodeOpened()
    }
  }

  hotmServ = inject(HotmService)
}