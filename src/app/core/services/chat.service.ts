import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, finalize, tap } from 'rxjs';
import { ApiService, ChatRequest } from './api.service';

export interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
  type: 'question' | 'answer' | 'error';
  responseTime?: number;
  followUps?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private followUpsSubject = new BehaviorSubject<string[]>([]);

  messages$ = this.messagesSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();
  followUps$ = this.followUpsSubject.asObservable();

  constructor(private apiService: ApiService) {}

  /**
   * Send a question to the AI chat service
   */
  sendQuestion(userId: string, resourceContext: any, question: string): void {
    if (!question.trim()) {
      return;
    }

    // Add user message immediately
    const userMessage: ChatMessage = {
      text: question,
      isUser: true,
      timestamp: new Date(),
      type: 'question'
    };

    const currentMessages = [...this.messagesSubject.value, userMessage];
    this.messagesSubject.next(currentMessages);
    
    // Reset error and set loading state
    this.errorSubject.next(null);
    this.loadingSubject.next(true);
    this.followUpsSubject.next([]);

    // Record start time for response time calculation
    const startTime = Date.now();

    // Call API
    const request: ChatRequest = {
      userId,
      resourceContext,
      question
    };

    this.apiService.postChatQuestion(request).pipe(
      tap(response => {
        const responseTime = Date.now() - startTime;

        if (response.success && response.response) {
          // Add AI response message
          const aiMessage: ChatMessage = {
            text: response.response.answer,
            isUser: false,
            timestamp: new Date(),
            type: 'answer',
            responseTime,
            followUps: response.response.followUps
          };

          const updatedMessages = [...this.messagesSubject.value, aiMessage];
          this.messagesSubject.next(updatedMessages);
          
          // Update follow-up suggestions
          this.followUpsSubject.next(response.response.followUps);
        } else {
          // Add error message
          const errorMessage: ChatMessage = {
            text: response.errorMessage || 'Unknown error occurred',
            isUser: false,
            timestamp: new Date(),
            type: 'error',
            responseTime
          };

          const updatedMessages = [...this.messagesSubject.value, errorMessage];
          this.messagesSubject.next(updatedMessages);
          this.errorSubject.next(response.errorMessage || 'Failed to get AI response');
        }
      }),
      catchError(error => {
        const responseTime = Date.now() - startTime;
        console.error('Error in chat service:', error);
        
        // Add error message
        const errorMessage: ChatMessage = {
          text: error.message || 'Error communicating with AI service',
          isUser: false,
          timestamp: new Date(),
          type: 'error',
          responseTime
        };

        const updatedMessages = [...this.messagesSubject.value, errorMessage];
        this.messagesSubject.next(updatedMessages);
        this.errorSubject.next(error.message || 'Error communicating with AI service');
        
        throw error;
      }),
      finalize(() => {
        this.loadingSubject.next(false);
      })
    ).subscribe();
  }

  /**
   * Send a follow-up question
   */
  sendFollowUpQuestion(userId: string, resourceContext: any, followUpText: string): void {
    this.sendQuestion(userId, resourceContext, followUpText);
  }

  /**
   * Clear all chat messages
   */
  clearChat(): void {
    this.messagesSubject.next([]);
    this.errorSubject.next(null);
    this.followUpsSubject.next([]);
  }
} 