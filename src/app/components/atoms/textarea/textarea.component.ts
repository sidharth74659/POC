import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="textarea">
      <label *ngIf="label" class="textarea__label">{{ label }}</label>
      <textarea
        class="textarea__field"
        [attr.placeholder]="placeholder"
        [disabled]="disabled"
        [ngClass]="{ 'textarea__field--error': error }"
        [value]="value"
        (input)="onInput($event)"
        (focus)="focus.emit($event)"
        (blur)="blur.emit($event)"
        [attr.aria-invalid]="!!error"
        [attr.aria-describedby]="error ? 'textarea-error' : null"
        rows="4"
      ></textarea>
      <div *ngIf="error" class="textarea__error" id="textarea-error">{{ error }}</div>
    </div>
  `,
  styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() error: string | null = null;
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();
  @Output() focus = new EventEmitter<FocusEvent>();
  @Output() blur = new EventEmitter<FocusEvent>();

  onInput(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    this.valueChange.emit(value);
  }
} 