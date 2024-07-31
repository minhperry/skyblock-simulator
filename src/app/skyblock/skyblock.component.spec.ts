import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyblockComponent } from './skyblock.component';

describe('SkyblockComponent', () => {
  let component: SkyblockComponent;
  let fixture: ComponentFixture<SkyblockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkyblockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkyblockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
