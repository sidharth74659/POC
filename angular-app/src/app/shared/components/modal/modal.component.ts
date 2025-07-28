import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="onOverlayClick($event)" tabindex="-1" (keyup.escape)="close()">
      <div class="modal-container" [class]="modalClasses">
        <div class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
          <button 
            type="button" 
            class="modal-close" 
            (click)="close()"
            (keyup.enter)="close()"
            (keyup.space)="close()"
            aria-label="Close modal"
            tabindex="0"
          >
            ×
          </button>
        </div>
        
        <div class="modal-content">
          <ng-content></ng-content>
        </div>
        
        <div class="modal-footer" *ngIf="showFooter">
          <app-button 
            variant="ghost" 
            (clickEvent)="close()"
            [disabled]="loading"
          >
            {{ cancelText }}
          </app-button>
          <app-button 
            [variant]="confirmVariant" 
            (clickEvent)="confirm()"
            [loading]="loading"
            [disabled]="loading"
          >
            {{ confirmText }}
          </app-button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() showFooter = true;
  @Input() confirmText = 'Save';
  @Input() cancelText = 'Cancel';
  @Input() confirmVariant: 'primary' | 'secondary' | 'success' | 'warning' | 'error' = 'primary';
  @Input() loading = false;

  @Output() closeEvent = new EventEmitter<void>();
  @Output() confirmEvent = new EventEmitter<void>();

  get modalClasses(): string {
    return `modal-container--${this.size}`;
  }

  close(): void {
    this.closeEvent.emit();
  }

  confirm(): void {
    this.confirmEvent.emit();
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
} 