import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="error" 
      class="error-container p-3 mb-4 rounded-md bg-error-message text-error flex items-start"
    >
      <div class="error-icon mr-2 text-xl">⚠️</div>
      <div class="error-content">
        <h4 class="error-title font-medium mb-1">{{ title }}</h4>
        <p class="error-message text-sm">{{ error }}</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorDisplayComponent {
  @Input() error: string | null = null;
  @Input() title: string = 'Error';
} 