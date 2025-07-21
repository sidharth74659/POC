import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../services/state';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './text-input.html',
  styleUrl: './text-input.css'
})
export class TextInputComponent implements OnInit {
  @Output() textSubmit = new EventEmitter<string>();
  @Output() textChange = new EventEmitter<string>();

  userInput = '';
  isSubmitting = false;
  maxLength = 500;
  characterCount = 0;

  constructor(private stateService: StateService) {}

  ngOnInit(): void {
    // Initialize character count
    this.updateCharacterCount();
  }

  /**
   * Handle input changes
   */
  onInputChange(): void {
    this.updateCharacterCount();
    this.textChange.emit(this.userInput);
  }

  /**
   * Update character count
   */
  updateCharacterCount(): void {
    this.characterCount = this.userInput.length;
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.isValidInput()) {
      this.isSubmitting = true;
      this.textSubmit.emit(this.userInput.trim());
      
      // Reset form after submission
      setTimeout(() => {
        this.clearInput();
        this.isSubmitting = false;
      }, 100);
    }
  }

  /**
   * Handle Enter key press
   */
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSubmit();
    }
  }

  /**
   * Clear input
   */
  clearInput(): void {
    this.userInput = '';
    this.updateCharacterCount();
    this.textChange.emit('');
  }

  /**
   * Check if input is valid
   */
  isValidInput(): boolean {
    const trimmedInput = this.userInput.trim();
    return trimmedInput.length > 0 && trimmedInput.length <= this.maxLength;
  }

  /**
   * Get remaining characters
   */
  getRemainingCharacters(): number {
    return this.maxLength - this.characterCount;
  }

  /**
   * Check if input is near limit
   */
  isNearLimit(): boolean {
    return this.characterCount > this.maxLength * 0.8;
  }

  /**
   * Check if input is at limit
   */
  isAtLimit(): boolean {
    return this.characterCount >= this.maxLength;
  }

  /**
   * Get character count color class
   */
  getCharacterCountClass(): string {
    if (this.isAtLimit()) return 'limit-reached';
    if (this.isNearLimit()) return 'near-limit';
    return 'normal';
  }

  /**
   * Handle paste event to clean input
   */
  onPaste(event: ClipboardEvent): void {
    // Allow the paste to happen, then clean the input
    setTimeout(() => {
      this.userInput = this.userInput.substring(0, this.maxLength);
      this.updateCharacterCount();
    }, 0);
  }
}
