import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { By } from '@angular/platform-browser';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label', () => {
    component.label = 'Test Button';
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button'));
    expect(btn.nativeElement.textContent.trim()).toBe('Test Button');
  });

  it('should apply variant class', () => {
    component.variant = 'orange';
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button'));
    expect(btn.nativeElement.classList).toContain('button--orange');
  });

  it('should apply size class', () => {
    component.size = 'lg';
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button'));
    expect(btn.nativeElement.classList).toContain('button--lg');
  });

  it('should be disabled when disabled is true', () => {
    component.disabled = true;
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button'));
    expect(btn.nativeElement.disabled).toBeTrue();
  });

  it('should emit onClick event when clicked', () => {
    spyOn(component.onClick, 'emit');
    const btn = fixture.debugElement.query(By.css('button'));
    btn.nativeElement.click();
    expect(component.onClick.emit).toHaveBeenCalled();
  });
}); 