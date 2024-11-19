import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertaincolorComponent } from './certaincolor.component';

describe('CertaincolorComponent', () => {
  let component: CertaincolorComponent;
  let fixture: ComponentFixture<CertaincolorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CertaincolorComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(CertaincolorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
