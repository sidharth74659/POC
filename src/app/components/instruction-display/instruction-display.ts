import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Instruction } from '../../interfaces/instruction.interface';
import { StateService } from '../../services/state';

@Component({
  selector: 'app-instruction-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instruction-display.html',
  styleUrl: './instruction-display.css'
})
export class InstructionDisplayComponent implements OnInit, OnDestroy {
  @Input() instruction: Instruction | null = null;
  @Input() isLoading = false;
  @Input() error: string | null = null;

  currentInstruction: Instruction | null = null;
  isVisible = false;
  private subscriptions: Subscription[] = [];

  constructor(private stateService: StateService) {}

  ngOnInit(): void {
    // Subscribe to instruction changes
    this.subscriptions.push(
      this.stateService.subscribeToInstruction().subscribe(instruction => {
        this.currentInstruction = instruction;
        this.isVisible = !!instruction;
      })
    );

    // Subscribe to loading state
    this.subscriptions.push(
      this.stateService.subscribeToLoading().subscribe(isLoading => {
        this.isLoading = isLoading;
      })
    );

    // Subscribe to error state
    this.subscriptions.push(
      this.stateService.subscribeToError().subscribe(error => {
        this.error = error;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Get instruction type for styling
   */
  getInstructionType(): string {
    if (!this.currentInstruction) return 'default';
    
    switch (this.currentInstruction.action) {
      case 'navigate':
        return 'navigation';
      case 'toggle_input':
        return 'toggle';
      case 'clear_input':
        return 'clear';
      case 'show_help':
        return 'help';
      case 'show_error':
        return 'error';
      default:
        return 'default';
    }
  }

  /**
   * Get icon for instruction type
   */
  getInstructionIcon(): string {
    if (!this.currentInstruction) return 'info';
    
    switch (this.currentInstruction.action) {
      case 'navigate':
        return 'navigation';
      case 'toggle_input':
        return 'settings';
      case 'clear_input':
        return 'clear';
      case 'show_help':
        return 'help';
      case 'show_error':
        return 'error';
      default:
        return 'info';
    }
  }

  /**
   * Get status color for instruction
   */
  getStatusColor(): string {
    if (!this.currentInstruction) return 'default';
    
    if (this.currentInstruction.success) {
      return 'success';
    } else {
      return 'error';
    }
  }

  /**
   * Check if instruction has parameters
   */
  hasParameters(): boolean {
    return !!(this.currentInstruction?.parameters && 
           Object.keys(this.currentInstruction.parameters).length > 0);
  }

  /**
   * Get parameter display text
   */
  getParameterText(): string {
    if (!this.currentInstruction?.parameters) return '';
    
    const params = this.currentInstruction.parameters;
    if (params['commands'] && Array.isArray(params['commands'])) {
      return params['commands'].join('\n');
    }
    
    if (params['error']) {
      return params['error'];
    }
    
    if (params['mode']) {
      return `Switched to ${params['mode']} mode`;
    }
    
    return JSON.stringify(params, null, 2);
  }

  /**
   * Close the instruction display
   */
  closeInstruction(): void {
    this.stateService.setCurrentInstruction(null);
    this.isVisible = false;
  }

  /**
   * Get display instruction
   */
  getDisplayInstruction(): Instruction | null {
    return this.instruction || this.currentInstruction;
  }
}
