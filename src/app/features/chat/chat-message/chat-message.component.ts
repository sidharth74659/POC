import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../../shared/services/chat.service';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="message p-3 mb-3 rounded-md" 
      [ngClass]="{
        'message--user': message.role === 'user',
        'message--ai': message.role === 'assistant'
      }"
    >
      <div class="message-content">
        <p>{{ message.content }}</p>
      </div>
      
      <div class="message-meta flex items-center justify-between mt-2">
        <span class="message-time text-xs text-text-secondary">
          {{ message.timestamp | date:'shortTime' }}
        </span>
      </div>
    </div>
  `,
  styles: [`
    .message {
      max-width: 80%;
    }
    .message--user {
      background-color: var(--color-user-message, #e3f2fd);
      margin-left: auto;
    }
    .message--ai {
      background-color: var(--color-ai-message, #f5f5f5);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMessageComponent {
  @Input() message!: ChatMessage;
} 