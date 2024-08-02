import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  ngxMarkdownVersion = '18.0.0'

  markdown = `
# 0.1
- **Terminal**: Added Panes game
### 0.1.1
- **Terminal**: Register on mouse down instead of a full click
# 0.2
- **Terminal**: Added Numbers game
### 0.2.1
- **Terminal**: Add number solver for stupid people
# 0.3
- **Terminal**: Added Same Color game
`

}
