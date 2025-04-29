import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabelComponent } from './label.component';
import { By } from '@angular/platform-browser';

describe('LabelComponent', () => {
  let component: LabelComponent;
  let fixture: ComponentFixture<LabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(LabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the text', () => {
    component.text = 'Label Text';
    fixture.detectChanges();
    const labelEl = fixture.debugElement.query(By.css('.label'));
    expect(labelEl.nativeElement.textContent.trim()).toBe('Label Text');
  });

  it('should apply variant class', () => {
    component.variant = 'primary';
    fixture.detectChanges();
    const labelEl = fixture.debugElement.query(By.css('.label'));
    expect(labelEl.nativeElement.classList).toContain('label--primary');
  });

  it('should apply size class', () => {
    component.size = 'lg';
    fixture.detectChanges();
    const labelEl = fixture.debugElement.query(By.css('.label'));
    expect(labelEl.nativeElement.classList).toContain('label--lg');
  });

  it('should have default variant if not specified', () => {
    fixture.detectChanges();
    const labelEl = fixture.debugElement.query(By.css('.label'));
    expect(labelEl.nativeElement.classList).toContain('label--default');
  });

  it('should have medium size if not specified', () => {
    fixture.detectChanges();
    const labelEl = fixture.debugElement.query(By.css('.label'));
    expect(labelEl.nativeElement.classList).toContain('label--md');
  });
}); 