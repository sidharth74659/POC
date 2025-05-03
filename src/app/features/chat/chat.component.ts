import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatService, ChatMessage } from '../../shared/services/chat.service';
import { Resource } from '../../shared/models/resource.model';
import { Observable, Subscription } from 'rxjs';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { FollowUpComponent } from './follow-up/follow-up.component';
import { TypingIndicatorComponent } from './typing-indicator/typing-indicator.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    ChatMessageComponent, 
    FollowUpComponent, 
    TypingIndicatorComponent
  ],
  template: `
    <div 
      class="chat-sidebar fixed top-0 right-0 h-full w-96 bg-background shadow-lg z-50 flex flex-col transition-transform duration-200"
      [ngClass]="{'translate-x-0': isOpen, 'translate-x-full': !isOpen}"
    >
      <div class="chat-header p-4 bg-primary text-primary-foreground flex justify-between items-center">
        <h3 class="text-lg font-medium">AI Chat with {{ resourceName }}</h3>
        <button 
          (click)="onClose()" 
          class="text-primary-foreground hover:text-primary-light"
          aria-label="Close chat"
        >
          ✕
        </button>
      </div>
      
      <div class="chat-messages flex-1 p-4 overflow-y-auto flex flex-col">
        <div *ngIf="!(messages$ | async)?.length" class="text-center text-text-secondary p-4">
          Ask a question about this resource.
        </div>
        
        <app-chat-message 
          *ngFor="let message of messages$ | async" 
          [message]="message"
        ></app-chat-message>
        
        <app-typing-indicator *ngIf="loading$ | async"></app-typing-indicator>
        
        <app-follow-up 
          [followUps]="(followUps$ | async) ?? []"
          (followUpSelected)="onFollowUpSelected($event)"
        ></app-follow-up>
      </div>
      
      <div class="chat-error p-3 bg-error text-white" *ngIf="error$ | async as error">
        <p>{{ error }}</p>
      </div>
      
      <div class="chat-input p-4 border-t border-divider">
        <form [formGroup]="chatForm" (ngSubmit)="sendMessage()">
          <div class="flex">
            <input 
              type="text" 
              formControlName="message" 
              class="flex-1 p-2 border border-divider rounded-l-md focus:outline-none focus:border-primary"
              placeholder="Type your question..."
              [disabled]="(loading$ | async) === true"
            >
            <button 
              type="submit" 
              class="bg-primary text-primary-foreground px-4 py-2 rounded-r-md hover:bg-primary-dark transition-colors"
              [disabled]="chatForm.invalid || (loading$ | async) === true"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() resourceContext!: Resource;
  @Input() isOpen: boolean = false;
  @Output() closed = new EventEmitter<void>();
  
  chatForm: FormGroup;
  messages$!: Observable<ChatMessage[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  followUps$!: Observable<string[]>;
  
  private subscriptions = new Subscription();
  
  get resourceName(): string {
    return this.resourceContext?.name || 'Resource';
  }
  
  constructor(
    private fb: FormBuilder,
    private chatService: ChatService
  ) {
    this.chatForm = this.fb.group({
      message: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {
    this.messages$ = this.chatService.messages$;
    this.loading$ = this.chatService.loading$;
    this.error$ = this.chatService.error$;
    this.followUps$ = this.chatService.followUps$;
    
    // Clear chat messages when component initializes
    this.chatService.clearChat();
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  
  sendMessage(): void {
    if (this.chatForm.invalid || !this.resourceContext) return;
    
    const message = this.chatForm.get('message')?.value;
    const resourceContext = JSON.stringify(this.resourceContext);
    this.chatService.sendMessage(message, resourceContext);
    this.chatForm.reset();
  }
  
  onFollowUpSelected(followUp: string): void {
    if (!this.resourceContext) return;
    
    const resourceContext = JSON.stringify(this.resourceContext);
    this.chatService.sendMessage(followUp, resourceContext);
  }
  
  onClose(): void {
    this.closed.emit();
  }
} 