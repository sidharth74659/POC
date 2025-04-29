import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextareaComponent } from './textarea.component';
import { By } from '@angular/platform-browser';

describe('TextareaComponent', () => {
  let component: TextareaComponent;
  let fixture: ComponentFixture<TextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label', () => {
    component.label = 'Test Label';
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('.textarea__label'));
    expect(label.nativeElement.textContent).toContain('Test Label');
  });

  it('should set placeholder', () => {
    component.placeholder = 'Enter value';
    fixture.detectChanges();
    const textarea = fixture.debugElement.query(By.css('textarea'));
    expect(textarea.nativeElement.placeholder).toBe('Enter value');
  });

  it('should be disabled', () => {
    component.disabled = true;
    fixture.detectChanges();
    const textarea = fixture.debugElement.query(By.css('textarea'));
    expect(textarea.nativeElement.disabled).toBeTrue();
  });

  it('should show error message', () => {
    component.error = 'Error!';
    fixture.detectChanges();
    const error = fixture.debugElement.query(By.css('.textarea__error'));
    expect(error.nativeElement.textContent).toContain('Error!');
  });

  it('should emit valueChange on input', () => {
    spyOn(component.valueChange, 'emit');
    const textarea = fixture.debugElement.query(By.css('textarea'));
    textarea.nativeElement.value = 'abc';
    textarea.nativeElement.dispatchEvent(new Event('input'));
    expect(component.valueChange.emit).toHaveBeenCalledWith('abc');
  });

  it('should emit focus event', () => {
    spyOn(component.focus, 'emit');
    const textarea = fixture.debugElement.query(By.css('textarea'));
    textarea.nativeElement.dispatchEvent(new Event('focus'));
    expect(component.focus.emit).toHaveBeenCalled();
  });

  it('should emit blur event', () => {
    spyOn(component.blur, 'emit');
    const textarea = fixture.debugElement.query(By.css('textarea'));
    textarea.nativeElement.dispatchEvent(new Event('blur'));
    expect(component.blur.emit).toHaveBeenCalled();
  });
}); 