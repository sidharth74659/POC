import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="button button--{{ variant }} button--{{ size }}"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
      [attr.aria-disabled]="disabled"
      type="button"
    >
      <ng-content></ng-content>
      <span *ngIf="!hasContent">{{ label }}</span>
    </button>
  `,
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  @Input() label = 'Button';
  @Input() variant: 'primary' | 'secondary' | 'orange' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Output() onClick = new EventEmitter<MouseEvent>();

  get hasContent(): boolean {
    // Check if ng-content is projected
    return false; // Placeholder, can be improved with ContentChild if needed
  }
} 