import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxComponent } from './checkbox.component';
import { By } from '@angular/platform-browser';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label', () => {
    component.label = 'Test Label';
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('.checkbox__label'));
    expect(label.nativeElement.textContent.trim()).toBe('Test Label');
  });

  it('should set checked state', () => {
    component.checked = true;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input[type="checkbox"]'));
    expect(input.nativeElement.checked).toBeTrue();
  });

  it('should be disabled', () => {
    component.disabled = true;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input[type="checkbox"]'));
    const checkbox = fixture.debugElement.query(By.css('.checkbox'));
    expect(input.nativeElement.disabled).toBeTrue();
    expect(checkbox.nativeElement.classList).toContain('checkbox--disabled');
  });

  it('should emit checkedChange event on click', () => {
    spyOn(component.checkedChange, 'emit');
    const input = fixture.debugElement.query(By.css('input[type="checkbox"]'));
    input.nativeElement.click();
    input.nativeElement.dispatchEvent(new Event('change'));
    expect(component.checkedChange.emit).toHaveBeenCalledWith(true);
  });

  it('should generate unique id', () => {
    const checkbox1 = new CheckboxComponent();
    const checkbox2 = new CheckboxComponent();
    expect(checkbox1.id).not.toEqual(checkbox2.id);
    expect(checkbox1.id).toMatch(/^checkbox-[a-z0-9]+$/);
  });
}); 