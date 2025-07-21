import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface VoiceRecognitionError {
  error: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class VoiceService {
  private recognition: any;
  private isListening = false;
  private transcriptSubject = new BehaviorSubject<string>('');
  private isListeningSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new Subject<VoiceRecognitionError>();

  public transcript$ = this.transcriptSubject.asObservable();
  public isListening$ = this.isListeningSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor() {
    this.initializeSpeechRecognition();
  }

  /**
   * Initialize speech recognition
   */
  private initializeSpeechRecognition(): void {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      this.errorSubject.next({
        error: 'unsupported',
        message: 'Speech recognition is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.'
      });
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    // Configure recognition settings
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    // Set up event handlers
    this.setupRecognitionHandlers();
  }

  /**
   * Set up speech recognition event handlers
   */
  private setupRecognitionHandlers(): void {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.isListeningSubject.next(true);
      console.log('Speech recognition started');
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Update transcript
      const currentTranscript = this.transcriptSubject.value;
      const newTranscript = currentTranscript + finalTranscript + interimTranscript;
      this.transcriptSubject.next(newTranscript);

      // Clear interim results when final
      if (finalTranscript) {
        this.transcriptSubject.next(currentTranscript + finalTranscript);
      }
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      this.isListeningSubject.next(false);
      
      let errorMessage = 'Speech recognition error occurred';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech was detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone was found. Please check your microphone settings.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access was denied. Please allow microphone access and try again.';
          break;
        case 'network':
          errorMessage = 'Network error occurred. Please check your internet connection.';
          break;
        case 'service-not-allowed':
          errorMessage = 'Speech recognition service is not allowed. Please try again later.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }

      this.errorSubject.next({
        error: event.error,
        message: errorMessage
      });
      
      console.error('Speech recognition error:', event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.isListeningSubject.next(false);
      console.log('Speech recognition ended');
    };
  }

  /**
   * Start voice recognition
   */
  startListening(): void {
    if (!this.recognition) {
      this.errorSubject.next({
        error: 'unsupported',
        message: 'Speech recognition is not available in this browser.'
      });
      return;
    }

    if (this.isListening) {
      console.log('Already listening');
      return;
    }

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      this.errorSubject.next({
        error: 'start_failed',
        message: 'Failed to start speech recognition. Please try again.'
      });
    }
  }

  /**
   * Stop voice recognition
   */
  stopListening(): void {
    if (!this.recognition || !this.isListening) {
      return;
    }

    try {
      this.recognition.stop();
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  }

  /**
   * Clear current transcript
   */
  clearTranscript(): void {
    this.transcriptSubject.next('');
  }

  /**
   * Get current transcript
   */
  getCurrentTranscript(): string {
    return this.transcriptSubject.value;
  }

  /**
   * Check if currently listening
   */
  getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Check if speech recognition is supported
   */
  isSupported(): boolean {
    return !!(window as any).webkitSpeechRecognition || !!(window as any).SpeechRecognition;
  }

  /**
   * Reset the voice service
   */
  reset(): void {
    this.stopListening();
    this.clearTranscript();
    this.isListeningSubject.next(false);
  }
}
