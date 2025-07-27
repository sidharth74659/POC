import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { CustomerService } from '../../../core/services/customer.service';
import { OrderService } from '../../../core/services/order.service';
import { ICustomer, ICustomerApiResponse } from '../../../shared/models/customer.model';
import { IOrder, IOrdersApiResponse } from '../../../shared/models/order.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss'],
  imports: [CommonModule, ButtonComponent],
  standalone: true
})
export class CustomerDetailComponent implements OnInit, OnDestroy {
  private customerService = inject(CustomerService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  customer: ICustomer | null = null;
  orders: IOrder[] = [];
  isLoadingOrders = false;

  get currentUser() {
    return this.authService.currentUser;
  }

  ngOnInit(): void {
    this.loadCustomer();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCustomer(): void {
    const customerId = this.route.snapshot.paramMap.get('customerId');
    if (!customerId) {
      this.router.navigate(['/customers']);
      return;
    }

    this.customerService.getCustomerById(customerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ICustomerApiResponse) => {
          this.customer = response.data || null;
          if (this.customer) {
            this.loadOrders();
          } else {
            this.router.navigate(['/customers']);
          }
        },
        error: (error: Error) => {
          console.error('Error loading customer:', error);
          this.router.navigate(['/customers']);
        }
      });
  }

  loadOrders(): void {
    if (!this.customer) return;

    this.isLoadingOrders = true;
    this.orderService.getOrdersByCustomer(this.customer.customerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: IOrdersApiResponse) => {
          this.orders = response.data || [];
          this.isLoadingOrders = false;
        },
        error: (error: Error) => {
          console.error('Error loading orders:', error);
          this.isLoadingOrders = false;
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/customers']);
  }

  editCustomer(): void {
    if (this.customer) {
      this.router.navigate(['/customers', this.customer.customerId, 'edit']);
    }
  }

  deleteCustomer(): void {
    if (!this.customer) return;

    if (confirm(`Are you sure you want to delete customer "${this.customer.name}"?`)) {
      this.customerService.deleteCustomer(this.customer.customerId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigate(['/customers']);
          },
          error: (error: Error) => {
            console.error('Error deleting customer:', error);
          }
        });
    }
  }

  createOrder(): void {
    if (this.customer) {
      this.router.navigate(['/customers', this.customer.customerId, 'orders', 'new']);
    }
  }

  editOrder(order: IOrder): void {
    this.router.navigate(['/customers', this.customer?.customerId, 'orders', order.orderId, 'edit']);
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }
} 