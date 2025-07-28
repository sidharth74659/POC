import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { SharedService } from '../../../core/services/shared.service';
import { environment } from '../../../../environments/environment';
import { TTenantCheckApiResponse } from '@shared-schemas/index';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="landing-container">
      <div class="landing-content">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Checking tenant...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .landing-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .landing-content {
      text-align: center;
      color: white;
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    p {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 500;
    }
  `]
})
export class LandingComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private sharedService = inject(SharedService);

  ngOnInit(): void {
    this.checkTenantAndRedirect();
  }

  private checkTenantAndRedirect(): void {
    const hostname = window.location.hostname;
    
    // If we're on the main domain (hubnest.live), redirect to register
    if (hostname === 'hubnest.live' || hostname === 'www.hubnest.live') {
      this.router.navigate(['/auth/register']);
      return;
    }

    // Check if tenant exists
    const apiUrl = `${environment.apiBaseUrl}/tenants/check`;
    
    this.http.get<TTenantCheckApiResponse>(apiUrl).pipe(
      map(response => {
        console.log('Tenant check response:', response);
        if (response.success && response.data) {
          // Tenant exists, redirect to login
          this.router.navigate(['/auth/login']);
        } else {
          // Tenant doesn't exist, redirect to register
          this.router.navigate(['/auth/register']);
        }
      }),
      catchError(error => {
        console.error('Tenant check error:', error);
        // On error, redirect to register (fail-safe)
        this.router.navigate(['/auth/register']);
        return of(null);
      })
    ).subscribe();
  }
} 