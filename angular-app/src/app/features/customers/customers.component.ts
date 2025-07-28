import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CustomerService } from '../../core/services/customer.service';
import { AuthService } from '../../core/services/auth.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { ICustomer, ICustomersApiResponse } from '../../shared/models/customer.model';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, ButtonComponent, InputComponent],
  template: `
    <div class="customers-container">
      <header class="customers-header">
        <h1>Customers</h1>
        <div class="header-actions">
          <span class="user-info">Welcome, {{ currentUser?.email }}</span>
          <app-button variant="ghost" (clickEvent)="logout()">Logout</app-button>
        </div>
      </header>
      
      <main class="customers-content">
        <div class="customers-toolbar">
          <div class="search-section">
            <app-input 
              [placeholder]="'Search customers...'"
              (valueChange)="onSearchChange($event)">
            </app-input>
          </div>
          <div class="actions-section">
            <app-button (clickEvent)="createCustomer()">Add Customer</app-button>
          </div>
        </div>

        <div class="customers-list" *ngIf="!isLoading; else loading">
          <div class="customer-card" *ngFor="let customer of filteredCustomers" (click)="viewCustomerOrders(customer)" tabindex="0" (keyup.enter)="viewCustomerOrders(customer)">
            <div class="customer-info">
              <h3>{{ customer.name }}</h3>
              <p class="customer-id">ID: {{ customer.customerId }}</p>
              <p class="customer-email">{{ customer.contact.email }}</p>
              <p class="customer-phone" *ngIf="customer.contact.phone">{{ customer.contact.phone }}</p>
            </div>
            <div class="customer-actions">
              <app-button variant="ghost" (clickEvent)="editCustomer(customer, $event)">Edit</app-button>
              <app-button variant="ghost" (clickEvent)="deleteCustomer(customer, $event)">Delete</app-button>
            </div>
          </div>
          
          <div class="empty-state" *ngIf="filteredCustomers.length === 0">
            <p>No customers found.</p>
            <app-button (clickEvent)="createCustomer()">Add Your First Customer</app-button>
          </div>
        </div>

        <ng-template #loading>
          <div class="loading-state">
            <p>Loading customers...</p>
          </div>
        </ng-template>
      </main>
    </div>
  `,
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit, OnDestroy {
  private customerService = inject(CustomerService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  customers: ICustomer[] = [];
  filteredCustomers: ICustomer[] = [];
  searchTerm = '';
  isLoading = false;

  get currentUser() {
    return this.authService.currentUser;
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.customerService.getAllCustomers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ICustomersApiResponse) => {
          this.customers = response.data || [];
          this.filterCustomers();
          this.isLoading = false;
        },
        error: (error: Error) => {
          console.error('Error loading customers:', error);
          this.isLoading = false;
        }
      });
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.filterCustomers();
  }

  filterCustomers(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCustomers = this.customers;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredCustomers = this.customers.filter(customer =>
        customer.name.toLowerCase().includes(term) ||
        customer.customerId.toLowerCase().includes(term) ||
        customer.contact.email.toLowerCase().includes(term)
      );
    }
  }

  createCustomer(): void {
    this.router.navigate(['/customers/new']);
  }

  editCustomer(customer: ICustomer, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/customers', customer.customerId, 'edit']);
  }

  deleteCustomer(customer: ICustomer, event: Event): void {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete customer "${customer.name}"?`)) {
      this.customerService.deleteCustomer(customer.customerId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadCustomers();
          },
          error: (error: Error) => {
            console.error('Error deleting customer:', error);
          }
        });
    }
  }

  viewCustomerOrders(customer: ICustomer): void {
    this.router.navigate(['/customers', customer.customerId, 'orders']);
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }
} 