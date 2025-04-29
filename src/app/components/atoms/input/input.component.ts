import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="input">
      <label *ngIf="label" class="input__label">{{ label }}</label>
      <input
        class="input__field"
        [attr.placeholder]="placeholder"
        [disabled]="disabled"
        [ngClass]="{ 'input__field--error': error }"
        [value]="value"
        (input)="onInput($event)"
        (focus)="focus.emit($event)"
        (blur)="blur.emit($event)"
        [attr.aria-invalid]="!!error"
        [attr.aria-describedby]="error ? 'input-error' : null"
      />
      <div *ngIf="error" class="input__error" id="input-error">{{ error }}</div>
    </div>
  `,
  styleUrls: ['./input.component.scss']
})
export class InputComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() error: string | null = null;
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();
  @Output() focus = new EventEmitter<FocusEvent>();
  @Output() blur = new EventEmitter<FocusEvent>();

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.valueChange.emit(value);
  }
} 