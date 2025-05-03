import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-typing-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="typing-indicator p-3 mb-3 rounded-md bg-surface">
      <div class="flex">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>
  `,
  styles: [`
    .typing-indicator {
      max-width: 60px;
    }
    .dot {
      width: 8px;
      height: 8px;
      background-color: #757575;
      border-radius: 50%;
      margin-right: 4px;
      animation: bounce 1.5s infinite ease-in-out;
    }
    .dot:nth-child(1) {
      animation-delay: 0s;
    }
    .dot:nth-child(2) {
      animation-delay: 0.2s;
    }
    .dot:nth-child(3) {
      animation-delay: 0.4s;
    }
    @keyframes bounce {
      0%, 60%, 100% {
        transform: translateY(0);
      }
      30% {
        transform: translateY(-6px);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypingIndicatorComponent {} 