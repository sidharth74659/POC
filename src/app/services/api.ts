import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import { Instruction, ApiResponse } from '../interfaces/instruction.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Updated to use the new Express server
  private apiUrl = 'http://localhost:3001/api/process-instruction';
  private fallbackApiUrl = '/api/instructions'; // Fallback to mock API

  constructor(private http: HttpClient) {}

  /**
   * Fetch instructions from the API based on user input
   * @param userInput The user's input text
   * @param language Optional language code
   * @returns Observable of API response
   */
  getInstructions(userInput: string, language: string = 'en'): Observable<ApiResponse> {
    // Try the new Express server first
    return this.callExpressServer(userInput, language).pipe(
      catchError(error => {
        console.warn('Express server failed, falling back to mock API:', error);
        return this.mockGetInstructions(userInput);
      })
    );
  }

  /**
   * Call the Express server with function calling capabilities
   * @param userInput The user's input text
   * @param language The language code
   * @returns Observable of API response
   */
  private callExpressServer(userInput: string, language: string): Observable<ApiResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const requestBody = {
      text: userInput,
      language: language
    };

    return this.http.post<ApiResponse>(this.apiUrl, requestBody, { headers }).pipe(
      catchError(error => {
        console.error('Express server error:', error);
        return throwError(() => new Error('Failed to call Express server'));
      })
    );
  }

  /**
   * Mock implementation of the API call (fallback)
   * @param userInput The user's input text
   * @returns Observable of mock API response
   */
  private mockGetInstructions(userInput: string): Observable<ApiResponse> {
    // Simulate network delay
    return of(this.generateMockResponse(userInput)).pipe(
      delay(1000), // Simulate 1 second delay
      catchError(error => {
        console.error('API Error:', error);
        return throwError(() => new Error('Failed to fetch instructions'));
      })
    );
  }

  /**
   * Generate mock response based on user input
   * @param userInput The user's input text
   * @returns Mock API response
   */
  private generateMockResponse(userInput: string): ApiResponse {
    const input = userInput.toLowerCase().trim();
    
    // Mock instruction mapping based on user input
    if (input.includes('home') || input.includes('main') || input.includes('start')) {
      return {
        data: {
          instruction: 'Navigate to home page',
          action: 'navigate',
          route: '/home',
          parameters: {},
          success: true
        },
        message: 'Navigating to home page'
      };
    }
    
    if (input.includes('about') || input.includes('info') || input.includes('details')) {
      return {
        data: {
          instruction: 'Navigate to about page',
          action: 'navigate',
          route: '/about',
          parameters: {},
          success: true
        },
        message: 'Navigating to about page'
      };
    }
    
    if (input.includes('contact') || input.includes('help') || input.includes('support')) {
      return {
        data: {
          instruction: 'Navigate to contact page',
          action: 'navigate',
          route: '/contact',
          parameters: {},
          success: true
        },
        message: 'Navigating to contact page'
      };
    }
    
    if (input.includes('voice') || input.includes('speak') || input.includes('microphone')) {
      return {
        data: {
          instruction: 'Switch to voice input mode',
          action: 'toggle_input',
          route: '/home',
          parameters: { mode: 'voice' },
          success: true
        },
        message: 'Switching to voice input mode'
      };
    }
    
    if (input.includes('text') || input.includes('type') || input.includes('keyboard')) {
      return {
        data: {
          instruction: 'Switch to text input mode',
          action: 'toggle_input',
          route: '/home',
          parameters: { mode: 'text' },
          success: true
        },
        message: 'Switching to text input mode'
      };
    }
    
    if (input.includes('clear') || input.includes('reset') || input.includes('clean')) {
      return {
        data: {
          instruction: 'Clear current input and reset state',
          action: 'clear_input',
          route: '/home',
          parameters: {},
          success: true
        },
        message: 'Input cleared and state reset'
      };
    }
    
    if (input.includes('help') || input.includes('commands') || input.includes('what can you do')) {
      return {
        data: {
          instruction: 'Show available commands and features',
          action: 'show_help',
          route: '/home',
          parameters: {
            commands: [
              'Say "home" to go to home page',
              'Say "about" to go to about page',
              'Say "contact" to go to contact page',
              'Say "voice" to switch to voice input',
              'Say "text" to switch to text input',
              'Say "clear" to reset the application'
            ]
          },
          success: true
        },
        message: 'Showing available commands'
      };
    }
    
    // Default response for unrecognized input
    return {
      data: {
        instruction: 'Input not recognized',
        action: 'show_error',
        route: '/home',
        parameters: {
          error: 'I did not understand that. Try saying "help" for available commands.'
        },
        success: false
      },
      message: 'Input not recognized'
    };
  }

  /**
   * Handle API errors
   * @param error The error object
   * @returns Observable of error response
   */
  private handleError(error: any): Observable<ApiResponse> {
    console.error('API Error:', error);
    return of({
      data: {
        instruction: 'Error occurred while processing request',
        action: 'show_error',
        route: '/home',
        parameters: {
          error: 'An error occurred while processing your request. Please try again.'
        },
        success: false
      },
      error: error.message || 'Unknown error occurred'
    });
  }
}
