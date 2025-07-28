import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  ICustomerCreateRequest,
  ICustomerApiResponse,
  ICustomersApiResponse,
  ICustomerUpdateRequest
} from '../../shared/models/customer.model';
import { SchemaService } from '../../shared/services/schema.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly API_URL = `${environment.apiBaseUrl}/customers`;

  private http = inject(HttpClient);
  private schemaService = inject(SchemaService);

  getAllCustomers(): Observable<ICustomersApiResponse> {
    return this.http.get<ICustomersApiResponse>(this.API_URL).pipe(
      catchError(this.handleError)
    );
  }

  getCustomerById(customerId: string): Observable<ICustomerApiResponse> {
    return this.http.get<ICustomerApiResponse>(`${this.API_URL}/${customerId}`).pipe(
      catchError(this.handleError)
    );
  }

  createCustomer(customerData: ICustomerCreateRequest): Observable<ICustomerApiResponse> {
    // Validate request data using shared schema
    const validation = this.schemaService.safeValidate(
      this.schemaService.customerCreateRequestSchema, 
      customerData
    );
    if (!validation.success) {
      return throwError(() => new Error('Invalid customer data'));
    }

    return this.http.post<ICustomerApiResponse>(this.API_URL, customerData).pipe(
      tap(response => {
        // Validate response using shared schema
        const responseValidation = this.schemaService.safeValidate(
          this.schemaService.customerApiResponseSchema, 
          response
        );
        if (!responseValidation.success) {
          console.warn('Invalid customer response format:', responseValidation.error);
        }
      }),
      catchError(this.handleError)
    );
  }

  updateCustomer(customerId: string, customerData: ICustomerUpdateRequest): Observable<ICustomerApiResponse> {
    // Validate request data using shared schema
    const validation = this.schemaService.safeValidate(
      this.schemaService.customerUpdateRequestSchema, 
      customerData
    );
    if (!validation.success) {
      return throwError(() => new Error('Invalid customer data'));
    }

    return this.http.put<ICustomerApiResponse>(`${this.API_URL}/${customerId}`, customerData).pipe(
      tap(response => {
        // Validate response using shared schema
        const responseValidation = this.schemaService.safeValidate(
          this.schemaService.customerApiResponseSchema, 
          response
        );
        if (!responseValidation.success) {
          console.warn('Invalid customer response format:', responseValidation.error);
        }
      }),
      catchError(this.handleError)
    );
  }

  deleteCustomer(customerId: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.API_URL}/${customerId}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    return throwError(() => new Error(errorMessage));
  }
} 