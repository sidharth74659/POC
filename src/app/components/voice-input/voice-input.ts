import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VoiceService, VoiceRecognitionError } from '../../services/voice';
import { StateService } from '../../services/state';

@Component({
  selector: 'app-voice-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './voice-input.html',
  styleUrl: './voice-input.css'
})
export class VoiceInputComponent implements OnInit, OnDestroy {
  @Output() transcriptChange = new EventEmitter<string>();
  @Output() error = new EventEmitter<string>();

  transcript = '';
  isListening = false;
  isSupported = true;
  errorMessage = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private voiceService: VoiceService,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.isSupported = this.voiceService.isSupported();
    
    // Subscribe to transcript changes
    this.subscriptions.push(
      this.voiceService.transcript$.subscribe(transcript => {
        this.transcript = transcript;
        this.transcriptChange.emit(transcript);
      })
    );

    // Subscribe to listening state
    this.subscriptions.push(
      this.voiceService.isListening$.subscribe(isListening => {
        this.isListening = isListening;
      })
    );

    // Subscribe to errors
    this.subscriptions.push(
      this.voiceService.error$.subscribe((error: VoiceRecognitionError) => {
        this.errorMessage = error.message;
        this.error.emit(error.message);
        this.isListening = false;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.voiceService.reset();
  }

  /**
   * Toggle voice recognition
   */
  toggleListening(): void {
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  /**
   * Start voice recognition
   */
  startListening(): void {
    this.errorMessage = '';
    this.voiceService.startListening();
  }

  /**
   * Stop voice recognition
   */
  stopListening(): void {
    this.voiceService.stopListening();
  }

  /**
   * Clear transcript
   */
  clearTranscript(): void {
    this.voiceService.clearTranscript();
    this.transcript = '';
    this.transcriptChange.emit('');
  }

  /**
   * Get current transcript
   */
  getCurrentTranscript(): string {
    return this.voiceService.getCurrentTranscript();
  }

  /**
   * Check if voice recognition is supported
   */
  isVoiceSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Handle microphone button click
   */
  onMicrophoneClick(): void {
    if (!this.isSupported) {
      this.errorMessage = 'Voice recognition is not supported in this browser.';
      this.error.emit(this.errorMessage);
      return;
    }

    this.toggleListening();
  }

  /**
   * Handle keyboard events
   */
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !this.isListening) {
      this.startListening();
    } else if (event.key === 'Escape' && this.isListening) {
      this.stopListening();
    }
  }
}
