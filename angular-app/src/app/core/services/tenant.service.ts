import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  ITenantCreateRequest,
  ITenantResponse,
  ITenantSettings,
  ITenantsResponse,
  ITenantUpdateRequest
} from '../../shared/models/tenant.model';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private readonly API_URL = `${environment.apiBaseUrl}/tenants`;

  private http = inject(HttpClient);

  getTenantBySubdomain(subdomain: string): Observable<ITenantResponse> {
    return this.http.get<ITenantResponse>(`${this.API_URL}/subdomain/${subdomain}`).pipe(
      catchError(this.handleError)
    );
  }

  getTenantById(id: string): Observable<ITenantResponse> {
    return this.http.get<ITenantResponse>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getAllTenants(): Observable<ITenantsResponse> {
    return this.http.get<ITenantsResponse>(this.API_URL).pipe(
      catchError(this.handleError)
    );
  }

  createTenant(tenantData: ITenantCreateRequest): Observable<ITenantResponse> {
    return this.http.post<ITenantResponse>(this.API_URL, tenantData).pipe(
      catchError(this.handleError)
    );
  }

  updateTenant(id: string, tenantData: ITenantUpdateRequest): Observable<ITenantResponse> {
    return this.http.put<ITenantResponse>(`${this.API_URL}/${id}`, tenantData).pipe(
      catchError(this.handleError)
    );
  }

  deleteTenant(id: string): Observable<ITenantResponse> {
    return this.http.delete<ITenantResponse>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  activateTenant(id: string): Observable<ITenantResponse> {
    return this.http.patch<ITenantResponse>(`${this.API_URL}/${id}/activate`, {}).pipe(
      catchError(this.handleError)
    );
  }

  deactivateTenant(id: string): Observable<ITenantResponse> {
    return this.http.patch<ITenantResponse>(`${this.API_URL}/${id}/deactivate`, {}).pipe(
      catchError(this.handleError)
    );
  }

  getCurrentTenant(): Observable<ITenantResponse> {
    return this.http.get<ITenantResponse>(`${this.API_URL}/current`).pipe(
      catchError(this.handleError)
    );
  }

  updateTenantSettings(id: string, settings: ITenantSettings): Observable<ITenantResponse> {
    return this.http.patch<ITenantResponse>(`${this.API_URL}/${id}/settings`, settings).pipe(
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

    console.error('TenantService error:', error);
    return throwError(() => new Error(errorMessage));
  }
} 