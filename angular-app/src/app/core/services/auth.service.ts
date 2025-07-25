import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { 
  ILoginRequest, 
  ILoginResponse, 
  IAuthState, 
  IUser, 
  IMeResponse
} from '../../shared/models/auth.model';

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

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      this.validateSession(token);
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

  login(credentials: ILoginRequest): Observable<ILoginResponse> {
    this.updateAuthState({ ...this.getCurrentState(), isLoading: true, error: null });

    return this.http.post<ILoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        const { token, user } = response;
        localStorage.setItem(this.TOKEN_KEY, token);
        this.updateAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
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

  validateSession(token: string): void {
    this.updateAuthState({ ...this.getCurrentState(), isLoading: true });

    this.http.get<IMeResponse>(`${this.API_URL}/me`).pipe(
      map(response => {
        this.updateAuthState({
          user: response.user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      }),
      catchError(() => {
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
  get currentUser(): IUser | null {
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
  hasRole(role: string): boolean {
    const user = this.currentUser;
    return user ? user.roles.includes(role) : false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.currentUser;
    return user ? roles.some(role => user.roles.includes(role)) : false;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }
} 