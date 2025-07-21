import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { VoiceInputComponent } from '../../components/voice-input/voice-input';
import { TextInputComponent } from '../../components/text-input/text-input';
import { InstructionDisplayComponent } from '../../components/instruction-display/instruction-display';
import { ApiService } from '../../services/api';
import { VoiceService } from '../../services/voice';
import { StateService } from '../../services/state';
import { UserInput } from '../../interfaces/instruction.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, VoiceInputComponent, TextInputComponent, InstructionDisplayComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  currentInputMode: 'voice' | 'text' = 'text';
  isLoading = false;
  error: string | null = null;
  currentInstruction: any = null;
  userInputs: UserInput[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private apiService: ApiService,
    private voiceService: VoiceService,
    private stateService: StateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to state changes
    this.subscriptions.push(
      this.stateService.subscribeToInputMode().subscribe(mode => {
        this.currentInputMode = mode;
      })
    );

    this.subscriptions.push(
      this.stateService.subscribeToLoading().subscribe(isLoading => {
        this.isLoading = isLoading;
      })
    );

    this.subscriptions.push(
      this.stateService.subscribeToInstruction().subscribe(instruction => {
        this.currentInstruction = instruction;
        if (instruction) {
          this.handleInstruction(instruction);
        }
      })
    );

    this.subscriptions.push(
      this.stateService.subscribeToError().subscribe(error => {
        this.error = error;
      })
    );

    this.subscriptions.push(
      this.stateService.subscribeToUserInputs().subscribe(inputs => {
        this.userInputs = inputs;
      })
    );

    // Set current route
    this.stateService.setCurrentRoute('/home');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Toggle between voice and text input modes
   */
  toggleInputMode(): void {
    const newMode = this.currentInputMode === 'voice' ? 'text' : 'voice';
    this.stateService.setInputMode(newMode);
    
    // Stop voice recognition if switching to text
    if (newMode === 'text') {
      this.voiceService.stopListening();
    }
  }

  /**
   * Handle voice transcript changes
   */
  onVoiceTranscriptChange(transcript: string): void {
    // Auto-submit if transcript is not empty and user stops speaking
    if (transcript.trim() && !this.voiceService.getIsListening()) {
      this.submitInput(transcript, 'voice');
    }
  }

  /**
   * Handle voice errors
   */
  onVoiceError(error: string): void {
    this.stateService.setError(error);
  }

  /**
   * Handle text input submission
   */
  onTextSubmit(text: string): void {
    this.submitInput(text, 'text');
  }

  /**
   * Submit input to API
   */
  submitInput(input: string, inputType: 'voice' | 'text'): void {
    if (!input.trim()) return;

    // Add to user input history
    const userInput: UserInput = {
      text: input.trim(),
      timestamp: new Date(),
      inputType
    };
    this.stateService.addUserInput(userInput);

    // Set loading state
    this.stateService.setLoading(true);
    this.stateService.setError(null);

    // Call API
    this.apiService.getInstructions(input.trim()).subscribe({
      next: (response) => {
        this.stateService.setLoading(false);
        this.stateService.setCurrentInstruction(response.data);
      },
      error: (error) => {
        this.stateService.setLoading(false);
        this.stateService.setError(error.message || 'An error occurred while processing your request.');
      }
    });
  }

  /**
   * Handle instruction execution
   */
  private handleInstruction(instruction: any): void {
    if (!instruction.success) {
      return;
    }

    switch (instruction.action) {
      case 'navigate':
        this.router.navigate([instruction.route]);
        this.stateService.setCurrentRoute(instruction.route);
        break;
      
      case 'toggle_input':
        if (instruction.parameters?.mode) {
          this.stateService.setInputMode(instruction.parameters.mode);
        }
        break;
      
      case 'clear_input':
        this.stateService.clearState();
        break;
      
      case 'show_help':
        // Help is already displayed in the instruction
        break;
      
      default:
        console.log('Unknown action:', instruction.action);
    }
  }

  /**
   * Clear current state
   */
  clearState(): void {
    this.stateService.clearState();
    this.voiceService.reset();
  }

  /**
   * Get input mode display text
   */
  getInputModeText(): string {
    return this.currentInputMode === 'voice' ? 'Voice Input' : 'Text Input';
  }

  /**
   * Check if voice is supported
   */
  isVoiceSupported(): boolean {
    return this.voiceService.isSupported();
  }
}
