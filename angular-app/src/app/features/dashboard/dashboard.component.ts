import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Dashboard</h1>
        <div class="header-actions">
          <span class="user-info">Welcome, {{ currentUser?.email }}</span>
          <app-button variant="ghost" (clickEvent)="logout()">Logout</app-button>
        </div>
      </header>
      
      <main class="dashboard-content">
        <div class="dashboard-grid">
          <div class="dashboard-card">
            <h3>Customers</h3>
            <p>Manage your customers</p>
            <app-button (clickEvent)="navigateToCustomers()">View Customers</app-button>
          </div>
          
          <div class="dashboard-card" *ngIf="isAdmin">
            <h3>Users</h3>
            <p>Manage users</p>
            <app-button (clickEvent)="navigateToUsers()">View Users</app-button>
          </div>
          
          <div class="dashboard-card" *ngIf="isAdmin">
            <h3>Tenants</h3>
            <p>Manage tenants</p>
            <app-button (clickEvent)="navigateToTenants()">View Tenants</app-button>
          </div>
        </div>
      </main>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  get currentUser() {
    return this.authService.currentUser;
  }

  get isAdmin() {
    return this.authService.isAdmin();
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }

  navigateToCustomers(): void {
    this.router.navigate(['/customers']);
  }

  navigateToUsers(): void {
    this.router.navigate(['/users']);
  }

  navigateToTenants(): void {
    this.router.navigate(['/tenants']);
  }
} 