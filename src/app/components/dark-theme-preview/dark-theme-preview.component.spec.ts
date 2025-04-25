import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemePreviewComponent } from './dark-theme-preview.component';

describe('DarkThemePreviewComponent', () => {
  let component: DarkThemePreviewComponent;
  let fixture: ComponentFixture<DarkThemePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DarkThemePreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DarkThemePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
