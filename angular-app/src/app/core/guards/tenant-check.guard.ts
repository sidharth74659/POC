import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../services/shared.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TenantCheckGuard implements CanActivate {
  private http = inject(HttpClient);
  private router = inject(Router);
  private sharedService = inject(SharedService);

  canActivate(): Observable<boolean> {
    const subdomain = this.sharedService.getSubdomain();
    
    // If we're on the main domain (hubnest.live), allow access to register
    if (subdomain === 'hubnest' || subdomain === 'www') {
      return of(true);
    }

    // Check if tenant exists
    const apiUrl = `${environment.apiBaseUrl}/tenants/check`;
    
    return this.http.get<{ success: boolean; data?: { id: string; name: string; subdomain: string; isActive: boolean } | null; message?: string }>(apiUrl).pipe(
      map(response => {
        if (response.success && response.data) {
          // Tenant exists, redirect to login
          this.router.navigate(['/auth/login']);
          return false;
        } else {
          // Tenant doesn't exist, allow access to register
          return true;
        }
      }),
      catchError(error => {
        console.error('Tenant check error:', error);
        // On error, allow access to register (fail-safe)
        return of(true);
      })
    );
  }
} 