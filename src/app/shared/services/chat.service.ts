import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  answer: string;
  followUpQuestions?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // private apiUrl = `${environment.apiUrl}/ai/chat`;
  private apiUrl = `${environment.apiUrl}/chat-tooling`;
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  private followUpsSubject = new BehaviorSubject<string[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  messages$ = this.messagesSubject.asObservable();
  followUps$ = this.followUpsSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  sendMessage(question: string, resourceContext?: string): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    // Add user message to chat history
    const userMessage: ChatMessage = {
      role: 'user',
      content: question,
      timestamp: new Date()
    };
    
    const currentMessages = this.messagesSubject.getValue();
    this.messagesSubject.next([...currentMessages, userMessage]);
    
    // Clear previous follow-ups
    this.followUpsSubject.next([]);

    // Send request to server
    this.http.post<ChatResponse>(this.apiUrl, {
      userId: 'current-user', // Replace with actual user ID if available
      question,
      resourceContext
    }).pipe(
      catchError(error => {
        console.error('Error sending message:', error);
        this.errorSubject.next('Failed to get a response. Please try again.');
        return of({ answer: 'Sorry, I encountered an error processing your request.' });
      }),
      tap(() => this.loadingSubject.next(false))
    ).subscribe(response => {
      // Add assistant response to chat history
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.answer,
        timestamp: new Date()
      };
      
      const updatedMessages = this.messagesSubject.getValue();
      this.messagesSubject.next([...updatedMessages, assistantMessage]);
      
      // Update follow-up questions if available
      if ('followUpQuestions' in response && response.followUpQuestions && response.followUpQuestions.length > 0) {
        this.followUpsSubject.next(response.followUpQuestions);
      }
    });
  }
  
  clearChat(): void {
    this.messagesSubject.next([]);
    this.followUpsSubject.next([]);
    this.errorSubject.next(null);
  }
} 