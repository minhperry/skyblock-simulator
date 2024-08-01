import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorerComponent } from './colorer.component';

describe('ColorerComponent', () => {
  let component: ColorerComponent;
  let fixture: ComponentFixture<ColorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ColorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
