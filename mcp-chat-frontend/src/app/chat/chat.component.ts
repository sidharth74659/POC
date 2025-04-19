import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  messages: { sender: string; text: string }[] = [];
  userInput: string = '';

  constructor(private http: HttpClient) {}

  async sendMessage() {
    const input = this.userInput.trim();
    if (!input) return;

    this.messages.push({ sender: 'User', text: input });
    this.userInput = '';

    this.http.post<{ reply: string }>('http://localhost:3000/api/chat', { message: input })
      .pipe(
        catchError(error => {
          console.error('Error communicating with backend:', error);
          this.messages.push({ sender: 'Assistant', text: 'Sorry, there was an error processing your request.' });
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          this.messages.push({ sender: 'Assistant', text: response.reply });
        }
      });
  }
}
