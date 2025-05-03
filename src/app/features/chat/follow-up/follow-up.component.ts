import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-follow-up',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="follow-up-container mt-4" *ngIf="followUps.length > 0">
      <h4 class="text-sm font-medium mb-2">Follow-up questions</h4>
      <div class="follow-up-buttons">
        <button 
          *ngFor="let question of followUps"
          (click)="onFollowUpClicked(question)"
          class="follow-up-button py-1 px-2 mr-2 mb-2 bg-surface hover:bg-surface-hover border border-divider rounded-md text-sm transition-colors"
        >
          {{ question }}
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FollowUpComponent {
  @Input() followUps: string[] = [];
  @Output() followUpSelected = new EventEmitter<string>();
  
  onFollowUpClicked(question: string): void {
    this.followUpSelected.emit(question);
  }
} 