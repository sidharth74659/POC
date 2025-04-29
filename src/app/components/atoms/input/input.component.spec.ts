import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';
import { By } from '@angular/platform-browser';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label', () => {
    component.label = 'Test Label';
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('.input__label'));
    expect(label.nativeElement.textContent).toContain('Test Label');
  });

  it('should set placeholder', () => {
    component.placeholder = 'Enter value';
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.placeholder).toBe('Enter value');
  });

  it('should be disabled', () => {
    component.disabled = true;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.disabled).toBeTrue();
  });

  it('should show error message', () => {
    component.error = 'Error!';
    fixture.detectChanges();
    const error = fixture.debugElement.query(By.css('.input__error'));
    expect(error.nativeElement.textContent).toContain('Error!');
  });

  it('should emit valueChange on input', () => {
    spyOn(component.valueChange, 'emit');
    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value = 'abc';
    input.nativeElement.dispatchEvent(new Event('input'));
    expect(component.valueChange.emit).toHaveBeenCalledWith('abc');
  });

  it('should emit focus event', () => {
    spyOn(component.focus, 'emit');
    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.dispatchEvent(new Event('focus'));
    expect(component.focus.emit).toHaveBeenCalled();
  });

  it('should emit blur event', () => {
    spyOn(component.blur, 'emit');
    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.dispatchEvent(new Event('blur'));
    expect(component.blur.emit).toHaveBeenCalled();
  });
}); 