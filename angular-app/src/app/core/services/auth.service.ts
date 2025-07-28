import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { 
  ILoginRequest, 
  ILoginApiResponse, 
  IAuthState, 
  IUserResponse, 
  IMeApiResponse,
  IUserRoles
} from '../../shared/models/auth.model';
import { SchemaService } from '../../shared/services/schema.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiBaseUrl}/auth`;
  private readonly TOKEN_KEY = 'auth_token';
  
  private authStateSubject = new BehaviorSubject<IAuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  });

  public authState$ = this.authStateSubject.asObservable();

  private http = inject(HttpClient);
  private schemaService = inject(SchemaService);

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      // Use setTimeout to avoid circular dependency during initialization
      setTimeout(() => {
        this.validateSession(token);
      }, 0);
    } else {
      this.updateAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    }
  }

  login(credentials: ILoginRequest): Observable<ILoginApiResponse> {
    this.updateAuthState({ ...this.getCurrentState(), isLoading: true, error: null });

    // Validate request data using shared schema
    const validation = this.schemaService.safeValidate(this.schemaService.loginRequestSchema, credentials);
    if (!validation.success) {
      const error = new Error('Invalid login data');
      this.updateAuthState({
        ...this.getCurrentState(),
        isLoading: false,
        error: 'Invalid login data'
      });
      return throwError(() => error);
    }

    return this.http.post<ILoginApiResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        // Validate response using shared schema
        const responseValidation = this.schemaService.safeValidate(this.schemaService.loginApiResponseSchema, response);
        if (!responseValidation.success) {
          console.warn('Invalid login response format:', responseValidation.error);
        }
        
        // Handle the wrapped response structure
        if (response.success && response.data) {
          const { token, user } = response.data;
          
          if (!token || !user) {
            throw new Error('Invalid login response: missing token or user data');
          }
          
          localStorage.setItem(this.TOKEN_KEY, token);
          this.updateAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } else {
          throw new Error('Login failed: invalid response');
        }
      }),
      catchError(error => {
        this.updateAuthState({
          ...this.getCurrentState(),
          isLoading: false,
          error: error.error?.message || 'Login failed'
        });
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<void> {
    const token = this.getCurrentState().token;
    
    if (token) {
      return this.http.post<void>(`${this.API_URL}/logout`, {}).pipe(
        tap(() => this.clearAuth()),
        catchError(() => {
          this.clearAuth();
          return throwError(() => new Error('Logout failed'));
        })
      );
    } else {
      this.clearAuth();
      return new Observable(subscriber => {
        subscriber.next();
        subscriber.complete();
      });
    }
  }

  // Method to clear auth and trigger redirect (called by interceptor)
  clearAuthAndRedirect(): void {
    this.clearAuth();
  }

  // Method to handle session validation failure (called by interceptor)
  handleSessionValidationFailure(): void {
    this.clearAuth();
  }

  validateSession(token: string): void {
    this.updateAuthState({ ...this.getCurrentState(), isLoading: true });

    this.http.get<IMeApiResponse>(`${this.API_URL}/me`).pipe(
      map(response => {
        // Handle the wrapped response structure
        const user = response.data?.user;
        
        if (!user) {
          throw new Error('Invalid user data in response');
        }
        
        // Validate response using shared schema
        const responseValidation = this.schemaService.safeValidate(this.schemaService.meApiResponseSchema, response);
        if (!responseValidation.success) {
          console.warn('Invalid me response format:', responseValidation.error);
        }
        
        this.updateAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      }),
      catchError((error) => {
        console.error('Session validation failed:', error);
        // Just clear auth without redirect - let the interceptor handle navigation
        this.clearAuth();
        return throwError(() => new Error('Session validation failed'));
      })
    ).subscribe();
  }

  private clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.updateAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  }

  private updateAuthState(newState: IAuthState): void {
    this.authStateSubject.next(newState);
  }

  private getCurrentState(): IAuthState {
    return this.authStateSubject.value;
  }

  // Getters for current state
  get currentUser(): IUserResponse | null {
    return this.getCurrentState().user;
  }

  get isAuthenticated(): boolean {
    return this.getCurrentState().isAuthenticated;
  }

  get token(): string | null {
    return this.getCurrentState().token;
  }

  get isLoading(): boolean {
    return this.getCurrentState().isLoading;
  }

  get error(): string | null {
    return this.getCurrentState().error;
  }

  // Helper methods
  hasRole(role: IUserRoles): boolean {
    const user = this.currentUser;
    return user ? user.roles.includes(role) : false;
  }

  hasAnyRole(roles: IUserRoles[]): boolean {
    const user = this.currentUser;
    return user ? roles.some(role => user.roles.includes(role)) : false;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }
} 