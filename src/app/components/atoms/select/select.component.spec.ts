import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectComponent, SelectOption } from './select.component';
import { By } from '@angular/platform-browser';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;
  const mockOptions: SelectOption[] = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3', disabled: true }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    component.options = mockOptions;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label', () => {
    component.label = 'Test Label';
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('.select__label'));
    expect(label.nativeElement.textContent).toContain('Test Label');
  });

  it('should render options', () => {
    const options = fixture.debugElement.queryAll(By.css('option:not([value=""])'));
    expect(options.length).toBe(3);
    expect(options[0].nativeElement.textContent.trim()).toBe('Option 1');
    expect(options[1].nativeElement.textContent.trim()).toBe('Option 2');
    expect(options[2].nativeElement.textContent.trim()).toBe('Option 3');
  });

  it('should disable specific option', () => {
    const options = fixture.debugElement.queryAll(By.css('option:not([value=""])'));
    expect(options[2].nativeElement.disabled).toBeTrue();
  });

  it('should render placeholder option if provided', () => {
    component.placeholder = 'Select an option';
    fixture.detectChanges();
    const placeholderOption = fixture.debugElement.query(By.css('option[value=""]'));
    expect(placeholderOption.nativeElement.textContent.trim()).toBe('Select an option');
  });

  it('should be disabled', () => {
    component.disabled = true;
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('select'));
    const container = fixture.debugElement.query(By.css('.select__container'));
    expect(select.nativeElement.disabled).toBeTrue();
    expect(container.nativeElement.classList).toContain('select__container--disabled');
  });

  it('should show error state', () => {
    component.error = 'Error!';
    fixture.detectChanges();
    const error = fixture.debugElement.query(By.css('.select__error'));
    const container = fixture.debugElement.query(By.css('.select__container'));
    expect(error.nativeElement.textContent).toContain('Error!');
    expect(container.nativeElement.classList).toContain('select__container--error');
  });

  it('should emit valueChange on selection', () => {
    spyOn(component.valueChange, 'emit');
    const select = fixture.debugElement.query(By.css('select'));
    select.nativeElement.value = 'option2';
    select.nativeElement.dispatchEvent(new Event('change'));
    expect(component.valueChange.emit).toHaveBeenCalledWith('option2');
  });

  it('should select the correct option when value is provided', () => {
    component.value = 'option2';
    fixture.detectChanges();
    const selectedOption = fixture.debugElement.query(By.css('option[selected]'));
    expect(selectedOption.nativeElement.value).toBe('option2');
  });
}); 