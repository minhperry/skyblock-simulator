import { Component } from '@angular/core';
import {MarkdownComponent} from "ngx-markdown";

@Component({
  selector: 'sb-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [MarkdownComponent]
})
export class HomeComponent {
  ngxMarkdownVersion = '18.0.0'
}
