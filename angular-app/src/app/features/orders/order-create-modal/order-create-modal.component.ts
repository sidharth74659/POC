import { Component, EventEmitter, Input, Output, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { OrderService } from '../../../core/services/order.service';
import { IOrderCreateRequest } from '../../../shared/models/order.model';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-order-create-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ModalComponent],
  template: `
    <app-modal
      [isOpen]="isOpen"
      title="Create New Order"
      size="md"
      [loading]="isLoading"
      confirmText="Create Order"
      (closeEvent)="onClose()"
      (confirmEvent)="onSubmit()"
    >
      <form [formGroup]="orderForm" class="order-form">
        <div class="form-row">
          <app-input
            formControlName="orderId"
            label="Order ID"
            type="text"
            placeholder="ORD001"
            [required]="true"
            [errorMessage]="getErrorMessage('orderId')"
            helperText="Unique identifier for the order"
          ></app-input>
        </div>

        <div class="form-row">
          <app-input
            formControlName="product"
            label="Product"
            type="text"
            placeholder="Product Name"
            [required]="true"
            [errorMessage]="getErrorMessage('product')"
            helperText="Name of the product"
          ></app-input>
        </div>

        <div class="form-row form-row--two-columns">
          <app-input
            formControlName="quantity"
            label="Quantity"
            type="number"
            placeholder="1"
            [required]="true"
            [errorMessage]="getErrorMessage('quantity')"
            helperText="Number of items"
          ></app-input>

          <app-input
            formControlName="price"
            label="Price"
            type="number"
            placeholder="99.99"
            [required]="true"
            [errorMessage]="getErrorMessage('price')"
            helperText="Price per unit"
          ></app-input>
        </div>

        <div class="form-row">
          <app-input
            formControlName="notes"
            label="Notes"
            type="text"
            placeholder="Additional notes about the order"
            [errorMessage]="getErrorMessage('notes')"
            helperText="Optional notes for the order"
          ></app-input>
        </div>
      </form>
    </app-modal>
  `,
  styleUrls: ['./order-create-modal.component.scss']
})
export class OrderCreateModalComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Input() customerId = '';
  @Output() closeEvent = new EventEmitter<void>();
  @Output() orderCreated = new EventEmitter<IOrderCreateRequest>();

  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  private destroy$ = new Subject<void>();

  orderForm!: FormGroup;
  isLoading = false;

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.orderForm = this.fb.group({
      orderId: ['ORD_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9), [Validators.required]],
      product: ['Premium Widget', [Validators.required]],
      quantity: [2, [Validators.required, Validators.min(1)]],
      price: [99.99, [Validators.required, Validators.min(0.01)]],
      notes: ['Test order with premium widgets', []]
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.orderForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (control.errors['min']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${control.errors['min'].min}`;
      }
    }
    return '';
  }

  onSubmit(): void {
    if (this.orderForm.valid && this.customerId) {
      this.isLoading = true;
      
      const formValue = this.orderForm.value;
      const orderData: IOrderCreateRequest = {
        customerId: this.customerId,
        orderId: formValue.orderId,
        details: {
          product: formValue.product,
          quantity: formValue.quantity,
          price: formValue.price,
          notes: formValue.notes || undefined
        }
      };

      this.orderService.createOrder(orderData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.orderCreated.emit(orderData);
            this.onClose();
          },
          error: (error: Error) => {
            console.error('Error creating order:', error);
            this.isLoading = false;
          }
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  onClose(): void {
    this.orderForm.reset();
    this.initForm();
    this.closeEvent.emit();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.orderForm.controls).forEach(key => {
      const control = this.orderForm.get(key);
      control?.markAsTouched();
    });
  }
} 