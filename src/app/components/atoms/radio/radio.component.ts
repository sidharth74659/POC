import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="radio" [ngClass]="{ 'radio--disabled': disabled }">
      <input
        type="radio"
        class="radio__input"
        [id]="id"
        [checked]="checked"
        [disabled]="disabled"
        [name]="name"
        [value]="value"
        (change)="onRadioChange($event)"
        [attr.aria-disabled]="disabled"
      />
      <label 
        [for]="id" 
        class="radio__label"
      >
        {{ label }}
      </label>
    </div>
  `,
  styleUrls: ['./radio.component.scss']
})
export class RadioComponent {
  @Input() label = '';
  @Input() checked = false;
  @Input() disabled = false;
  @Input() name = '';
  @Input() value = '';
  @Input() id = `radio-${Math.random().toString(36).substring(2, 9)}`;
  @Output() checkedChange = new EventEmitter<{checked: boolean, value: string}>();

  onRadioChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.checkedChange.emit({
      checked: this.checked,
      value: this.value
    });
  }
} 