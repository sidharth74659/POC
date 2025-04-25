import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorTokenViewerComponent } from './color-token-viewer.component';

describe('ColorTokenViewerComponent', () => {
  let component: ColorTokenViewerComponent;
  let fixture: ComponentFixture<ColorTokenViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorTokenViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorTokenViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
