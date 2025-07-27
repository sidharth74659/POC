import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { SchemaService } from '../../../shared/services/schema.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ILoginRequest } from '../../../shared/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1 class="login-title">Sign On</h1>
          <p class="login-subtitle">Access your account</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <app-input
            formControlName="email"
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            [required]="true"
            [errorMessage]="getErrorMessage('email')"
            helperText="We'll never share your email"
          ></app-input>

          <app-input
            formControlName="password"
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            [required]="true"
            [showPasswordToggle]="true"
            [errorMessage]="getErrorMessage('password')"
          ></app-input>

          <div class="form-actions">
            <app-button
              type="submit"
              variant="primary"
              size="lg"
              [fullWidth]="true"
              [loading]="isLoading"
              [disabled]="loginForm.invalid || isLoading"
            >
              Sign In
            </app-button>
          </div>
        </form>

        <div class="login-footer">
          <p class="login-footer-text">
            Don't have an account?
            <a routerLink="/auth/register" class="login-footer-link">Register here</a>
          </p>
        </div>

        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  private destroy$ = new Subject<void>();
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private schemaService = inject(SchemaService);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Subscribe to auth state changes
    this.authService.authState$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(authState => {
      this.isLoading = authState.isLoading;
      
      if (authState.isAuthenticated) {
        this.router.navigate(['/customers']);
      }
      
      if (authState.error) {
        this.errorMessage = authState.error;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.errorMessage = '';

      const credentials: ILoginRequest = this.loginForm.value;

      // Validate form data using shared schema
      const validation = this.schemaService.validateForm(this.schemaService.loginRequestSchema, credentials);
      if (!validation.isValid) {
        this.errorMessage = 'Please check your input and try again';
        return;
      }

      this.authService.login(credentials).subscribe({
        next: () => {
          // Login successful, navigation is handled by auth service
        },
        error: (error) => {
          this.errorMessage = error.message || 'Login failed';
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field && field.invalid && field.touched) {
      if (field.hasError('required')) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.hasError('email')) {
        return 'Please enter a valid email address';
      }
      if (field.hasError('minlength')) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least 6 characters`;
      }
    }
    return '';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
} 