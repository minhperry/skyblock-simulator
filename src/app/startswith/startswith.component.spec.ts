import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartswithComponent } from './startswith.component';

describe('StartswithComponent', () => {
  let component: StartswithComponent;
  let fixture: ComponentFixture<StartswithComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [StartswithComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(StartswithComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
