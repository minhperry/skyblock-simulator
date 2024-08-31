import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'checkbox',
    template: `
      <div class="item {{label}}">
      <label [for]="label" class="form-label">
          <input type="checkbox" [(checked)]="check" (change)="onCheckboxChange($event)" ngDefaultControl>
          {{ text }}
      </label>
      </div>
    `,
    styles: ['.form-label { margin-bottom: 0; }']
})
export class TextableCheckboxComponent {
    @Input() label!: string;
    @Input() text!: string;
    @Input() check: boolean = false;

    @Output() checkChange = new EventEmitter<boolean>();

    onCheckboxChange(event: Event) {
        this.checkChange.emit((event.target as HTMLInputElement).checked);
    }
}