import { Component, EventEmitter, Input, Output, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CustomerService } from '../../../core/services/customer.service';
import { ICustomerCreateRequest } from '../../../shared/models/customer.model';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-customer-create-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ModalComponent],
  template: `
    <app-modal
      [isOpen]="isOpen"
      title="Create New Customer"
      size="md"
      [loading]="isLoading"
      confirmText="Create Customer"
      (closeEvent)="onClose()"
      (confirmEvent)="onSubmit()"
    >
      <form [formGroup]="customerForm" class="customer-form">
        <div class="form-row">
          <app-input
            formControlName="customerId"
            label="Customer ID"
            type="text"
            placeholder="CUST001"
            [required]="true"
            [errorMessage]="getErrorMessage('customerId')"
            helperText="Unique identifier for the customer"
          ></app-input>
        </div>

        <div class="form-row">
          <app-input
            formControlName="name"
            label="Customer Name"
            type="text"
            placeholder="John Doe"
            [required]="true"
            [errorMessage]="getErrorMessage('name')"
            helperText="Full name of the customer"
          ></app-input>
        </div>

        <div class="form-row">
          <app-input
            formControlName="email"
            label="Email"
            type="email"
            placeholder="john@example.com"
            [required]="true"
            [errorMessage]="getErrorMessage('email')"
            helperText="Primary contact email"
          ></app-input>
        </div>

        <div class="form-row">
          <app-input
            formControlName="phone"
            label="Phone"
            type="tel"
            placeholder="+1234567890"
            [errorMessage]="getErrorMessage('phone')"
            helperText="Contact phone number (optional)"
          ></app-input>
        </div>

        <div class="form-row">
          <app-input
            formControlName="street"
            label="Street Address"
            type="text"
            placeholder="123 Main St"
            [errorMessage]="getErrorMessage('street')"
            helperText="Street address (optional)"
          ></app-input>
        </div>

        <div class="form-row form-row--two-columns">
          <app-input
            formControlName="city"
            label="City"
            type="text"
            placeholder="New York"
            [errorMessage]="getErrorMessage('city')"
            helperText="City"
          ></app-input>

          <app-input
            formControlName="state"
            label="State"
            type="text"
            placeholder="NY"
            [errorMessage]="getErrorMessage('state')"
            helperText="State/Province"
          ></app-input>
        </div>

        <div class="form-row form-row--two-columns">
          <app-input
            formControlName="zipCode"
            label="ZIP Code"
            type="text"
            placeholder="10001"
            [errorMessage]="getErrorMessage('zipCode')"
            helperText="ZIP/Postal code"
          ></app-input>

          <app-input
            formControlName="country"
            label="Country"
            type="text"
            placeholder="USA"
            [errorMessage]="getErrorMessage('country')"
            helperText="Country"
          ></app-input>
        </div>
      </form>
    </app-modal>
  `,
  styleUrls: ['./customer-create-modal.component.scss']
})
export class CustomerCreateModalComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() closeEvent = new EventEmitter<void>();
  @Output() customerCreated = new EventEmitter<ICustomerCreateRequest>();

  private fb = inject(FormBuilder);
  private customerService = inject(CustomerService);
  private destroy$ = new Subject<void>();

  customerForm!: FormGroup;
  isLoading = false;

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.customerForm = this.fb.group({
      customerId: ['CUST_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9), [Validators.required]],
      name: ['John Doe', [Validators.required]],
      email: ['john@example.com', [Validators.required, Validators.email]],
      phone: ['+1234567890', []],
      street: ['123 Main Street', []],
      city: ['New York', []],
      state: ['NY', []],
      zipCode: ['10001', []],
      country: ['USA', []]
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.customerForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
    }
    return '';
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      this.isLoading = true;
      
      const formValue = this.customerForm.value;
      const customerData: ICustomerCreateRequest = {
        customerId: formValue.customerId,
        name: formValue.name,
        contact: {
          email: formValue.email,
          phone: formValue.phone || undefined,
          address: {
            street: formValue.street || undefined,
            city: formValue.city || undefined,
            state: formValue.state || undefined,
            zipCode: formValue.zipCode || undefined,
            country: formValue.country || undefined
          }
        }
      };

      this.customerService.createCustomer(customerData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.customerCreated.emit(customerData);
            this.onClose();
          },
          error: (error: Error) => {
            console.error('Error creating customer:', error);
            this.isLoading = false;
          }
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  onClose(): void {
    this.customerForm.reset();
    this.initForm();
    this.closeEvent.emit();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.customerForm.controls).forEach(key => {
      const control = this.customerForm.get(key);
      control?.markAsTouched();
    });
  }
} 