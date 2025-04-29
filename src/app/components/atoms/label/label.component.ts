import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LabelVariant = 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'info';
export type LabelSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-label',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span 
      class="label"
      [ngClass]="[
        'label--' + variant,
        'label--' + size
      ]"
    >
      {{ text }}
    </span>
  `,
  styleUrls: ['./label.component.scss']
})
export class LabelComponent {
  @Input() text = '';
  @Input() variant: LabelVariant = 'default';
  @Input() size: LabelSize = 'md';
} 