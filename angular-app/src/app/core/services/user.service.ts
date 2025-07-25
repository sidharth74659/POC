import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  IUserCreateRequest,
  IUserResponse,
  IUsersResponse,
  IUserUpdateRequest
} from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = `${environment.apiBaseUrl}/users`;

  private http = inject(HttpClient);

  getAllUsers(): Observable<IUsersResponse> {
    return this.http.get<IUsersResponse>(this.API_URL).pipe(
      catchError(this.handleError)
    );
  }

  getUserById(id: string): Observable<IUserResponse> {
    return this.http.get<IUserResponse>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createUser(userData: IUserCreateRequest): Observable<IUserResponse> {
    return this.http.post<IUserResponse>(this.API_URL, userData).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(id: string, userData: IUserUpdateRequest): Observable<IUserResponse> {
    return this.http.put<IUserResponse>(`${this.API_URL}/${id}`, userData).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: string): Observable<IUserResponse> {
    return this.http.delete<IUserResponse>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  activateUser(id: string): Observable<IUserResponse> {
    return this.http.patch<IUserResponse>(`${this.API_URL}/${id}/activate`, {}).pipe(
      catchError(this.handleError)
    );
  }

  deactivateUser(id: string): Observable<IUserResponse> {
    return this.http.patch<IUserResponse>(`${this.API_URL}/${id}/deactivate`, {}).pipe(
      catchError(this.handleError)
    );
  }

  updateUserRoles(id: string, roles: string[]): Observable<IUserResponse> {
    return this.http.patch<IUserResponse>(`${this.API_URL}/${id}/roles`, { roles }).pipe(
      catchError(this.handleError)
    );
  }

  resetUserPassword(id: string): Observable<IUserResponse> {
    return this.http.post<IUserResponse>(`${this.API_URL}/${id}/reset-password`, {}).pipe(
      catchError(this.handleError)
    );
  }

  getCurrentUser(): Observable<IUserResponse> {
    return this.http.get<IUserResponse>(`${this.API_URL}/me`).pipe(
      catchError(this.handleError)
    );
  }

  updateProfile(userData: Partial<IUserUpdateRequest>): Observable<IUserResponse> {
    return this.http.put<IUserResponse>(`${this.API_URL}/profile`, userData).pipe(
      catchError(this.handleError)
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<IUserResponse> {
    return this.http.post<IUserResponse>(`${this.API_URL}/change-password`, {
      currentPassword,
      newPassword
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    console.error('UserService error:', error);
    return throwError(() => new Error(errorMessage));
  }
} 