import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { 
  IOrderCreateRequest, 
  IOrderUpdateRequest, 
  IOrderApiResponse, 
  IOrdersApiResponse,
  IOrderFilters,
  OrderStatus
} from '../../shared/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly API_URL = `${environment.apiBaseUrl}/orders`;

  private http = inject(HttpClient);

  getAllOrders(filters?: IOrderFilters): Observable<IOrdersApiResponse> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.customerId) params = params.set('customerId', filters.customerId);
      if (filters.dateFrom) params = params.set('dateFrom', filters.dateFrom.toISOString());
      if (filters.dateTo) params = params.set('dateTo', filters.dateTo.toISOString());
      if (filters.search) params = params.set('search', filters.search);
    }

    return this.http.get<IOrdersApiResponse>(this.API_URL, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getOrderById(id: string): Observable<IOrderApiResponse> {
    return this.http.get<IOrderApiResponse>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createOrder(orderData: IOrderCreateRequest): Observable<IOrderApiResponse> {
    return this.http.post<IOrderApiResponse>(this.API_URL, orderData).pipe(
      catchError(this.handleError)
    );
  }

  updateOrder(id: string, orderData: IOrderUpdateRequest): Observable<IOrderApiResponse> {
    return this.http.put<IOrderApiResponse>(`${this.API_URL}/${id}`, orderData).pipe(
      catchError(this.handleError)
    );
  }

  deleteOrder(id: string): Observable<IOrderApiResponse> {
    return this.http.delete<IOrderApiResponse>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateOrderStatus(id: string, status: OrderStatus): Observable<IOrderApiResponse> {
    return this.http.patch<IOrderApiResponse>(`${this.API_URL}/${id}/status`, { status }).pipe(
      catchError(this.handleError)
    );
  }

  getOrdersByStatus(status: OrderStatus): Observable<IOrdersApiResponse> {
    return this.http.get<IOrdersApiResponse>(`${this.API_URL}/status/${status}`).pipe(
      catchError(this.handleError)
    );
  }

  getOrdersByCustomer(customerId: string): Observable<IOrdersApiResponse> {
    return this.http.get<IOrdersApiResponse>(`${this.API_URL}/customer/${customerId}`).pipe(
      catchError(this.handleError)
    );
  }

  getOrderStatistics(): Observable<IOrderApiResponse> {
    return this.http.get<IOrderApiResponse>(`${this.API_URL}/statistics`).pipe(
      catchError(this.handleError)
    );
  }

  exportOrders(filters?: IOrderFilters, format: 'csv' | 'pdf' = 'csv'): Observable<Blob> {
    let params = new HttpParams().set('format', format);
    
    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.customerId) params = params.set('customerId', filters.customerId);
      if (filters.dateFrom) params = params.set('dateFrom', filters.dateFrom.toISOString());
      if (filters.dateTo) params = params.set('dateTo', filters.dateTo.toISOString());
      if (filters.search) params = params.set('search', filters.search);
    }

    return this.http.get(`${this.API_URL}/export`, { 
      params, 
      responseType: 'blob' 
    }).pipe(
      catchError(this.handleError)
    );
  }

  bulkUpdateOrders(orderIds: string[], updates: Partial<IOrderUpdateRequest>): Observable<IOrdersApiResponse> {
    return this.http.patch<IOrdersApiResponse>(`${this.API_URL}/bulk-update`, {
      orderIds,
      updates
    }).pipe(
      catchError(this.handleError)
    );
  }

  bulkDeleteOrders(orderIds: string[]): Observable<IOrdersApiResponse> {
    return this.http.delete<IOrdersApiResponse>(`${this.API_URL}/bulk-delete`, {
      body: { orderIds }
    }).pipe(
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