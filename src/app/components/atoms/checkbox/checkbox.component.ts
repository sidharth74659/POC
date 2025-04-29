import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="checkbox" [ngClass]="{ 'checkbox--disabled': disabled }">
      <input
        type="checkbox"
        class="checkbox__input"
        [id]="id"
        [checked]="checked"
        [disabled]="disabled"
        (change)="onCheckChange($event)"
        [attr.aria-disabled]="disabled"
      />
      <label 
        [for]="id" 
        class="checkbox__label"
      >
        {{ label }}
      </label>
    </div>
  `,
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent {
  @Input() label = '';
  @Input() checked = false;
  @Input() disabled = false;
  @Input() id = `checkbox-${Math.random().toString(36).substring(2, 9)}`;
  @Output() checkedChange = new EventEmitter<boolean>();

  onCheckChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.checkedChange.emit(this.checked);
  }
} 