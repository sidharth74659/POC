import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Instruction, UserInput } from '../interfaces/instruction.interface';

export interface AppState {
  currentInputMode: 'voice' | 'text';
  currentInstruction: Instruction | null;
  isLoading: boolean;
  error: string | null;
  userInputs: UserInput[];
  currentRoute: string;
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private initialState: AppState = {
    currentInputMode: 'text',
    currentInstruction: null,
    isLoading: false,
    error: null,
    userInputs: [],
    currentRoute: '/home'
  };

  private stateSubject = new BehaviorSubject<AppState>(this.initialState);
  public state$ = this.stateSubject.asObservable();
  private isUpdatingFromStorage = false;

  constructor() {
    this.loadStateFromStorage();
  }

  /**
   * Get current state
   */
  getCurrentState(): AppState {
    return this.stateSubject.value;
  }

  /**
   * Update state
   */
  private updateState(updates: Partial<AppState>): void {
    const currentState = this.stateSubject.value;
    const newState = { ...currentState, ...updates };
    this.stateSubject.next(newState);
    
    // Only save to storage if not loading from storage
    if (!this.isUpdatingFromStorage) {
      this.saveStateToStorage(newState);
    }
  }

  /**
   * Set input mode
   */
  setInputMode(mode: 'voice' | 'text'): void {
    this.updateState({ currentInputMode: mode });
  }

  /**
   * Get current input mode
   */
  getInputMode(): 'voice' | 'text' {
    return this.stateSubject.value.currentInputMode;
  }

  /**
   * Set loading state
   */
  setLoading(isLoading: boolean): void {
    this.updateState({ isLoading });
  }

  /**
   * Set current instruction
   */
  setCurrentInstruction(instruction: Instruction | null): void {
    this.updateState({ currentInstruction: instruction });
  }

  /**
   * Get current instruction
   */
  getCurrentInstruction(): Instruction | null {
    return this.stateSubject.value.currentInstruction;
  }

  /**
   * Set error
   */
  setError(error: string | null): void {
    this.updateState({ error });
  }

  /**
   * Get current error
   */
  getCurrentError(): string | null {
    return this.stateSubject.value.error;
  }

  /**
   * Add user input to history
   */
  addUserInput(input: UserInput): void {
    const currentState = this.stateSubject.value;
    const userInputs = [...currentState.userInputs, input];
    // Keep only last 10 inputs
    if (userInputs.length > 10) {
      userInputs.splice(0, userInputs.length - 10);
    }
    this.updateState({ userInputs });
  }

  /**
   * Get user input history
   */
  getUserInputs(): UserInput[] {
    return this.stateSubject.value.userInputs;
  }

  /**
   * Set current route
   */
  setCurrentRoute(route: string): void {
    this.updateState({ currentRoute: route });
  }

  /**
   * Get current route
   */
  getCurrentRoute(): string {
    return this.stateSubject.value.currentRoute;
  }

  /**
   * Clear all state
   */
  clearState(): void {
    this.updateState({
      currentInstruction: null,
      isLoading: false,
      error: null,
      userInputs: [],
      currentRoute: '/home'
    });
  }

  /**
   * Reset to initial state
   */
  resetState(): void {
    this.stateSubject.next(this.initialState);
    this.saveStateToStorage(this.initialState);
  }

  /**
   * Save state to localStorage
   */
  private saveStateToStorage(state: AppState): void {
    try {
      const stateToSave = {
        currentInputMode: state.currentInputMode,
        userInputs: state.userInputs.map(input => ({
          ...input,
          timestamp: input.timestamp.toISOString() // Convert Date to string
        })),
        currentRoute: state.currentRoute
      };
      localStorage.setItem('voice-ai-app-state', JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Error saving state to localStorage:', error);
    }
  }

  /**
   * Load state from localStorage
   */
  private loadStateFromStorage(): void {
    try {
      const savedState = localStorage.getItem('voice-ai-app-state');
      if (savedState) {
        this.isUpdatingFromStorage = true; // Set flag before loading
        const parsedState = JSON.parse(savedState);
        this.updateState({
          currentInputMode: parsedState.currentInputMode || 'text',
          userInputs: (parsedState.userInputs || []).map((input: any) => ({
            ...input,
            timestamp: new Date(input.timestamp) // Convert string back to Date
          })),
          currentRoute: parsedState.currentRoute || '/home'
        });
        this.isUpdatingFromStorage = false; // Reset flag after loading
      }
    } catch (error) {
      console.error('Error loading state from localStorage:', error);
    }
  }

  /**
   * Clear localStorage
   */
  clearStorage(): void {
    try {
      localStorage.removeItem('voice-ai-app-state');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Subscribe to specific state changes
   */
  subscribeToInputMode(): Observable<'voice' | 'text'> {
    return new Observable(observer => {
      const subscription = this.state$.subscribe(state => {
        observer.next(state.currentInputMode);
      });
      return () => subscription.unsubscribe();
    });
  }

  /**
   * Subscribe to loading state
   */
  subscribeToLoading(): Observable<boolean> {
    return new Observable(observer => {
      const subscription = this.state$.subscribe(state => {
        observer.next(state.isLoading);
      });
      return () => subscription.unsubscribe();
    });
  }

  /**
   * Subscribe to current instruction
   */
  subscribeToInstruction(): Observable<Instruction | null> {
    return new Observable(observer => {
      const subscription = this.state$.subscribe(state => {
        observer.next(state.currentInstruction);
      });
      return () => subscription.unsubscribe();
    });
  }

  /**
   * Subscribe to error state
   */
  subscribeToError(): Observable<string | null> {
    return new Observable(observer => {
      const subscription = this.state$.subscribe(state => {
        observer.next(state.error);
      });
      return () => subscription.unsubscribe();
    });
  }

  /**
   * Subscribe to user inputs
   */
  subscribeToUserInputs(): Observable<UserInput[]> {
    return new Observable(observer => {
      const subscription = this.state$.subscribe(state => {
        observer.next(state.userInputs);
      });
      return () => subscription.unsubscribe();
    });
  }
}
