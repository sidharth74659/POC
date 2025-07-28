import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SharedService } from 'src/app/core/services/shared.service';
import { TenantService } from '../../../core/services/tenant.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { SchemaService } from '../../../shared/services/schema.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent, RouterLink],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <h1 class="register-title">Create Your Tenant</h1>
          <p class="register-subtitle">Set up your multi-tenant workspace</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
          <app-input
            formControlName="companyName"
            id="companyName"
            label="Company Name"
            type="text"
            placeholder="Enter your company name"
            [required]="true"
            [errorMessage]="getErrorMessage('companyName')"
            helperText="This will be displayed in your workspace"
          ></app-input>

          <app-input
            formControlName="requestedSubdomain"
            id="requestedSubdomain"
            label="Subdomain"
            type="text"
            placeholder="your-company"
            [required]="true"
            [errorMessage]="getErrorMessage('requestedSubdomain')"
            helperText="This will be your workspace URL: {{registerForm.get('requestedSubdomain')?.value}}.hubnest.live"
          ></app-input>

          <app-input
            formControlName="adminEmail"
            id="adminEmail"
            label="Admin Email"
            type="email"
            placeholder="admin@yourcompany.com"
            [required]="true"
            [errorMessage]="getErrorMessage('adminEmail')"
            helperText="This will be your admin account"
          ></app-input>

          <app-input
            formControlName="adminPassword"
            id="adminPassword"
            label="Admin Password"
            type="password"
            placeholder="Enter a secure password"
            [required]="true"
            [showPasswordToggle]="true"
            [errorMessage]="getErrorMessage('adminPassword')"
            helperText="Minimum 6 characters"
          ></app-input>
        </form>        

        <div class="form-actions">
          <app-button
            type="submit"
            variant="primary"
            size="lg"
            [fullWidth]="true"
            [loading]="isLoading"
            [disabled]="registerForm.invalid || isLoading"
            (clickEvent)="onSubmit()"
          >
            Create Tenant
          </app-button>
        </div>

        <div class="register-footer">
          <p class="register-footer-text">
            Already have an account?
            <a routerLink="/auth/login" class="register-footer-link">Sign in here</a>
          </p>
        </div>

        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div *ngIf="successMessage" class="success-message">
          {{ successMessage }}
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  private destroy$ = new Subject<void>();
  private fb = inject(FormBuilder);
  private sharedService = inject(SharedService);
  private tenantService = inject(TenantService);
  private schemaService = inject(SchemaService);
  private router = inject(Router);

  constructor() {
    const subdomain = this.sharedService.getSubdomain();

    this.registerForm = this.fb.group({
      companyName: [subdomain, [Validators.required, Validators.minLength(2)]],
      requestedSubdomain: [subdomain, [
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(63),
        Validators.pattern(/^[a-z0-9-]+$/),
        this.subdomainValidator.bind(this)
      ]],
      adminEmail: [`admin@${subdomain}.com`, [Validators.required, Validators.email]],
      adminPassword: [`${subdomain}Pass123!`, [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Set up form value changes for autofill suggestions
    this.registerForm.get('companyName')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(companyName => {
      if (companyName && !this.registerForm.get('requestedSubdomain')?.touched) {
        const subdomain = this.generateSubdomain(companyName);
        this.registerForm.patchValue({ requestedSubdomain: subdomain });
      }
    });

    this.registerForm.get('requestedSubdomain')?.valueChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe(subdomain => {
      if (subdomain && !this.registerForm.get('adminEmail')?.touched) {
        const email = `${subdomain}@${subdomain}.com`;
        this.registerForm.patchValue({ adminEmail: email });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.errorMessage = '';
      this.successMessage = '';

      const formData = {
        name: this.registerForm.value.companyName,
        subdomain: this.registerForm.value.requestedSubdomain,
        adminEmail: this.registerForm.value.adminEmail,
        adminPassword: this.registerForm.value.adminPassword,
      };

      // Validate form data using shared schema
      const validation = this.schemaService.validateForm(
        this.schemaService.tenantCreateRequestSchema, 
        formData
      );
      
      if (!validation.isValid) {
        this.errorMessage = 'Please check your input and try again';
        return;
      }

      this.isLoading = true;

      this.tenantService.createTenant(formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Tenant created successfully! Redirecting to login...';
          
          // Redirect to login after a short delay
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Failed to create tenant';
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field && field.invalid && field.touched) {
      if (field.hasError('required')) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.hasError('email')) {
        return 'Please enter a valid email address';
      }
      if (field.hasError('minlength')) {
        const minLength = field.getError('minlength').requiredLength;
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${minLength} characters`;
      }
      if (field.hasError('maxlength')) {
        const maxLength = field.getError('maxlength').requiredLength;
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at most ${maxLength} characters`;
      }
      if (field.hasError('pattern')) {
        if (fieldName === 'requestedSubdomain') {
          return 'Subdomain can only contain lowercase letters, numbers, and hyphens';
        }
        return 'Invalid format';
      }
      if (field.hasError('subdomainInvalid')) {
        return field.getError('subdomainInvalid');
      }
    }
    return '';
  }

  private generateSubdomain(companyName: string): string {
    return companyName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 63);
  }

  private subdomainValidator(control: AbstractControl): Record<string, string> | null {
    const value = control.value;
    if (!value) return null;

    // Check for consecutive hyphens
    if (value.includes('--')) {
      return { subdomainInvalid: 'Subdomain cannot contain consecutive hyphens' };
    }

    // Check for leading/trailing hyphens
    if (value.startsWith('-') || value.endsWith('-')) {
      return { subdomainInvalid: 'Subdomain cannot start or end with hyphen' };
    }

    return null;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }
} 