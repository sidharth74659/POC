import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search';
export type InputSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="input-wrapper" [class]="wrapperClasses">
      <label *ngIf="label" [for]="id" class="input-label">
        {{ label }}
        <span *ngIf="required" class="required-indicator">*</span>
      </label>

      <div class="input-container">
        <input
          [id]="id"
          [type]="inputType"
          [placeholder]="placeholder"
          [required]="required"
          [disabled]="disabled"
          [readonly]="readonly"
          [class]="inputClasses"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          [attr.aria-describedby]="ariaDescribedby"
          [attr.aria-invalid]="hasError"
        />

        <div
          *ngIf="showPasswordToggle && type === 'password'"
          class="password-toggle"
        >
          <button
            type="button"
            class="password-toggle-btn"
            (click)="togglePasswordVisibility()"
            [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'"
          >
            <span
              class="password-toggle-icon"
              [class]="showPassword ? 'icon-eye-off' : 'icon-eye'"
            ></span>
          </button>
        </div>
      </div>

      <div *ngIf="helperText" class="input-helper">
        {{ helperText }}
      </div>

      <div *ngIf="errorMessage" class="input-error">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() type: InputType = 'text';
  @Input() size: InputSize = 'md';
  @Input() required = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() helperText?: string;
  @Input() errorMessage?: string;
  @Input() showPasswordToggle = false;
  @Input() id?: string;
  @Input() ariaDescribedby?: string;

  @Output() valueChange = new EventEmitter<string>();
  @Output() focusEvent = new EventEmitter<void>();
  @Output() blurEvent = new EventEmitter<void>();

  value = '';
  showPassword = false;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  private onChange = (_value: string) => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched = () => {};

  get inputType(): string {
    if (this.type === 'password' && this.showPassword) {
      return 'text';
    }
    return this.type;
  }

  get hasError(): boolean {
    return !!this.errorMessage;
  }

  get wrapperClasses(): string {
    const classes = [
      'input-wrapper',
      `input-wrapper--${this.size}`,
      this.hasError ? 'input-wrapper--error' : '',
      this.disabled ? 'input-wrapper--disabled' : '',
    ];
    return classes.filter(Boolean).join(' ');
  }

  get inputClasses(): string {
    const classes = [
      'input',
      `input--${this.size}`,
      this.hasError ? 'input--error' : '',
      this.disabled ? 'input--disabled' : '',
    ];
    return classes.filter(Boolean).join(' ');
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  onFocus(): void {
    this.onTouched();
    this.focusEvent.emit();
  }

  onBlur(): void {
    this.onTouched();
    this.blurEvent.emit();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
