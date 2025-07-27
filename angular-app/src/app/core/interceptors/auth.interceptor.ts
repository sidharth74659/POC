import { HttpRequest, HttpHandlerFn, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const TOKEN_KEY = 'auth_token';
  
  // Get token from localStorage
  const token = localStorage.getItem(TOKEN_KEY);
  
  // Get current hostname for tenant identification
  const currentHost = window.location.hostname;

  // Create a new request with the required headers
  const modifiedReq = req.clone({
    setHeaders: {
      'X-Tenant-Host': currentHost,
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  });

  // Handle the request and catch errors
  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Unauthorized - clear auth and redirect to login
        authService.logout().subscribe(() => {
          router.navigate(['/auth/login']);
        });
      } else if (error.status === 403) {
        // Forbidden - redirect to access denied page
        router.navigate(['/auth/access-denied']);
      } else if (error.status === 404) {
        // Not found - redirect to not found page
        router.navigate(['/not-found']);
      }

      return throwError(() => error);
    })
  );
}; 