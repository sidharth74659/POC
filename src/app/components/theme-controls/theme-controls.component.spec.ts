import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeControlsComponent } from './theme-controls.component';

describe('ThemeControlsComponent', () => {
  let component: ThemeControlsComponent;
  let fixture: ComponentFixture<ThemeControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemeControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
