import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconComponent } from './icon.component';
import { By } from '@angular/platform-browser';

describe('IconComponent', () => {
  let component: IconComponent;
  let fixture: ComponentFixture<IconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
    component.name = 'check'; // Set a default icon
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render SVG content', () => {
    const iconEl = fixture.debugElement.query(By.css('.icon'));
    expect(iconEl.nativeElement.innerHTML).toContain('svg');
  });

  it('should apply size class', () => {
    component.size = 'lg';
    fixture.detectChanges();
    const iconEl = fixture.debugElement.query(By.css('.icon'));
    expect(iconEl.nativeElement.classList).toContain('icon--lg');
  });

  it('should apply different icon when name changes', () => {
    const initialHTML = fixture.debugElement.query(By.css('.icon')).nativeElement.innerHTML;
    
    component.name = 'close';
    component.ngOnChanges({
      name: { currentValue: 'close', previousValue: 'check', firstChange: false, isFirstChange: () => false }
    });
    fixture.detectChanges();
    
    const updatedHTML = fixture.debugElement.query(By.css('.icon')).nativeElement.innerHTML;
    expect(updatedHTML).not.toEqual(initialHTML);
  });

  it('should apply color style', () => {
    component.color = '#FF0000';
    fixture.detectChanges();
    const iconEl = fixture.debugElement.query(By.css('.icon'));
    expect(iconEl.nativeElement.style.color).toBe('rgb(255, 0, 0)');
  });

  it('should have medium size by default', () => {
    fixture.detectChanges();
    const iconEl = fixture.debugElement.query(By.css('.icon'));
    expect(iconEl.nativeElement.classList).toContain('icon--md');
  });
}); 