import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { IOrder, IOrdersApiResponse } from '../../shared/models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, ButtonComponent, InputComponent],
  template: `
    <div class="orders-container">
      <header class="orders-header">
        <h1>Orders</h1>
        <div class="header-actions">
          <span class="user-info">Welcome, {{ currentUser?.email }}</span>
          <app-button variant="ghost" (clickEvent)="logout()">Logout</app-button>
        </div>
      </header>
      
      <main class="orders-content">
        <div class="orders-toolbar">
          <div class="search-section">
            <app-input 
              [placeholder]="'Search orders...'"
              (valueChange)="onSearchChange($event)">
            </app-input>
          </div>
        </div>

        <div class="orders-list" *ngIf="!isLoading; else loading">
          <div class="order-card" *ngFor="let order of filteredOrders" (click)="viewOrderDetail(order)" tabindex="0" (keyup.enter)="viewOrderDetail(order)">
            <div class="order-header">
              <h3>Order #{{ order.orderId }}</h3>
              <span class="order-status" [class]="'status-' + order.status">{{ order.status }}</span>
            </div>
            <div class="order-info">
              <p><strong>Customer ID:</strong> {{ order.customerId }}</p>
              <p><strong>Product:</strong> {{ order.details.product }}</p>
              <p><strong>Quantity:</strong> {{ order.details.quantity }}</p>
              <p><strong>Price:</strong> \${{ order.details.price }}</p>
              <p><strong>Total:</strong> \${{ (order.details.quantity * order.details.price).toFixed(2) }}</p>
              <p *ngIf="order.details.notes"><strong>Notes:</strong> {{ order.details.notes }}</p>
            </div>
            <div class="order-meta">
              <p>Created: {{ order.createdAt | date:'short' }}</p>
              <p>Updated: {{ order.updatedAt | date:'short' }}</p>
            </div>
            <div class="order-actions">
              <app-button variant="ghost" (clickEvent)="editOrder(order, $event)">Edit</app-button>
              <app-button variant="ghost" (clickEvent)="deleteOrder(order, $event)">Delete</app-button>
            </div>
          </div>
          
          <div class="empty-state" *ngIf="filteredOrders.length === 0">
            <p>No orders found.</p>
          </div>
        </div>

        <ng-template #loading>
          <div class="loading-state">
            <p>Loading orders...</p>
          </div>
        </ng-template>
      </main>
    </div>
  `,
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  orders: IOrder[] = [];
  filteredOrders: IOrder[] = [];
  searchTerm = '';
  isLoading = false;

  get currentUser() {
    return this.authService.currentUser;
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getAllOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: IOrdersApiResponse) => {
          this.orders = response.data || [];
          this.filterOrders();
          this.isLoading = false;
        },
        error: (error: Error) => {
          console.error('Error loading orders:', error);
          this.isLoading = false;
        }
      });
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.filterOrders();
  }

  filterOrders(): void {
    if (!this.searchTerm.trim()) {
      this.filteredOrders = this.orders;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredOrders = this.orders.filter(order =>
        order.orderId.toLowerCase().includes(term) ||
        order.customerId.toLowerCase().includes(term) ||
        order.details.product.toLowerCase().includes(term) ||
        order.status.toLowerCase().includes(term)
      );
    }
  }

  viewOrderDetail(order: IOrder): void {
    this.router.navigate(['/orders', order.orderId]);
  }

  editOrder(order: IOrder, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/orders', order.orderId, 'edit']);
  }

  deleteOrder(order: IOrder, event: Event): void {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete order "${order.orderId}"?`)) {
      this.orderService.deleteOrder(order.orderId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadOrders();
          },
          error: (error: Error) => {
            console.error('Error deleting order:', error);
          }
        });
    }
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }
} 