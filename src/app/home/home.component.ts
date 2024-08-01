import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  ngxMarkdownVersion = '18.0.0'

  markdown = `# 0.2
- **Terminal**: Register on mouse down instead of a full click

# 0.3
- **Terminal**: Added number game

### 0.3.1
- **Terminal**: Add number solver for stupid people`

}
