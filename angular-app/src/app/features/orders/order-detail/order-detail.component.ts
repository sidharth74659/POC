import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { IOrder, IOrderApiResponse } from '../../../shared/models/order.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="order-detail-container">
      <header class="order-detail-header">
        <div class="header-content">
          <button class="back-button" (click)="goBack()" type="button">
            ← Back to Orders
          </button>
          <h1>Order Details</h1>
        </div>
        <div class="header-actions">
          <span class="user-info">Welcome, {{ currentUser?.email }}</span>
          <app-button variant="ghost" (clickEvent)="logout()">Logout</app-button>
        </div>
      </header>
      
      <main class="order-detail-content">
        <div class="order-info-section" *ngIf="order; else loading">
          <div class="order-card">
            <div class="order-header">
              <h2>Order #{{ order.orderId }}</h2>
              <span class="order-status" [class]="'status-' + order.status">{{ order.status }}</span>
            </div>
            
            <div class="order-details">
              <div class="detail-row">
                <span class="detail-label">Customer ID:</span>
                <span class="detail-value">{{ order.customerId }}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Product:</span>
                <span class="detail-value">{{ order.details.product }}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Quantity:</span>
                <span class="detail-value">{{ order.details.quantity }}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Price:</span>
                <span class="detail-value">\${{ order.details.price }}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Total:</span>
                <span class="detail-value total">\${{ (order.details.quantity * order.details.price).toFixed(2) }}</span>
              </div>
              
              <div class="detail-row" *ngIf="order.details.notes">
                <span class="detail-label">Notes:</span>
                <span class="detail-value">{{ order.details.notes }}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Created:</span>
                <span class="detail-value">{{ order.createdAt | date:'medium' }}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Updated:</span>
                <span class="detail-value">{{ order.updatedAt | date:'medium' }}</span>
              </div>
            </div>
            
            <div class="order-actions">
              <app-button (clickEvent)="editOrder()">Edit Order</app-button>
              <app-button variant="ghost" (clickEvent)="deleteOrder()">Delete Order</app-button>
            </div>
          </div>
        </div>

        <ng-template #loading>
          <div class="loading-state">
            <p>Loading order details...</p>
          </div>
        </ng-template>
      </main>
    </div>
  `,
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  order: IOrder | null = null;
  isLoading = false;

  get currentUser() {
    return this.authService.currentUser;
  }

  ngOnInit(): void {
    this.loadOrder();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrder(): void {
    const orderId = this.route.snapshot.paramMap.get('orderId');
    if (!orderId) {
      this.router.navigate(['/orders']);
      return;
    }

    this.isLoading = true;
    this.orderService.getOrderById(orderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: IOrderApiResponse) => {
          this.order = response.data || null;
          this.isLoading = false;
        },
        error: (error: Error) => {
          console.error('Error loading order:', error);
          this.isLoading = false;
          this.router.navigate(['/orders']);
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }

  editOrder(): void {
    if (this.order) {
      this.router.navigate(['/orders', this.order.orderId, 'edit']);
    }
  }

  deleteOrder(): void {
    if (!this.order) return;

    if (confirm(`Are you sure you want to delete order "${this.order.orderId}"?`)) {
      this.orderService.deleteOrder(this.order.orderId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigate(['/orders']);
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