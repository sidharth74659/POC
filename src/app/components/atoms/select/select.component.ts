import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="select">
      <label *ngIf="label" class="select__label">{{ label }}</label>
      <div class="select__container" [ngClass]="{ 'select__container--error': error, 'select__container--disabled': disabled }">
        <select
          class="select__field"
          [disabled]="disabled"
          (change)="onChange($event)"
          [attr.aria-invalid]="!!error"
          [attr.aria-describedby]="error ? 'select-error' : null"
        >
          <option *ngIf="placeholder" value="" [disabled]="true" [selected]="!value">{{ placeholder }}</option>
          <option 
            *ngFor="let option of options" 
            [value]="option.value" 
            [disabled]="option.disabled"
            [selected]="option.value === value"
          >
            {{ option.label }}
          </option>
        </select>
        <div class="select__arrow">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
      <div *ngIf="error" class="select__error" id="select-error">{{ error }}</div>
    </div>
  `,
  styleUrls: ['./select.component.scss']
})
export class SelectComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() options: SelectOption[] = [];
  @Input() value: string | number = '';
  @Input() disabled = false;
  @Input() error: string | null = null;
  @Output() valueChange = new EventEmitter<string | number>();

  onChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.valueChange.emit(this.value);
  }
} 