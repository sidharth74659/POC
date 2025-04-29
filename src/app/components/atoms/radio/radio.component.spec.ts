import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RadioComponent } from './radio.component';
import { By } from '@angular/platform-browser';

describe('RadioComponent', () => {
  let component: RadioComponent;
  let fixture: ComponentFixture<RadioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(RadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label', () => {
    component.label = 'Test Label';
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('.radio__label'));
    expect(label.nativeElement.textContent.trim()).toBe('Test Label');
  });

  it('should set checked state', () => {
    component.checked = true;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input[type="radio"]'));
    expect(input.nativeElement.checked).toBeTrue();
  });

  it('should be disabled', () => {
    component.disabled = true;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input[type="radio"]'));
    const radio = fixture.debugElement.query(By.css('.radio'));
    expect(input.nativeElement.disabled).toBeTrue();
    expect(radio.nativeElement.classList).toContain('radio--disabled');
  });

  it('should set name attribute', () => {
    component.name = 'test-group';
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input[type="radio"]'));
    expect(input.nativeElement.name).toBe('test-group');
  });

  it('should set value attribute', () => {
    component.value = 'option1';
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input[type="radio"]'));
    expect(input.nativeElement.value).toBe('option1');
  });

  it('should emit checkedChange event on click', () => {
    spyOn(component.checkedChange, 'emit');
    component.value = 'option1';
    fixture.detectChanges();
    
    const input = fixture.debugElement.query(By.css('input[type="radio"]'));
    input.nativeElement.click();
    input.nativeElement.dispatchEvent(new Event('change'));
    
    expect(component.checkedChange.emit).toHaveBeenCalledWith({
      checked: true,
      value: 'option1'
    });
  });

  it('should generate unique id', () => {
    const radio1 = new RadioComponent();
    const radio2 = new RadioComponent();
    expect(radio1.id).not.toEqual(radio2.id);
    expect(radio1.id).toMatch(/^radio-[a-z0-9]+$/);
  });
}); 