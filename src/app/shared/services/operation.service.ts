import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { Operation } from '../models/operation.model';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class OperationService {
  private apiUrl = `${environment.apiUrl}/operations`;
  private operationsSubject = new BehaviorSubject<Operation[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  operations$ = this.operationsSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadOperations(filters?: {
    resourceId?: string;
    equipment?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    priority?: string;
  }): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    let params = new HttpParams();

    if (filters?.resourceId) {
      params = params.set('resourceId', filters.resourceId);
    }

    if (filters?.equipment) {
      params = params.set('equipment', filters.equipment);
    }

    if (filters?.startDate) {
      params = params.set('startDate', filters.startDate);
    }

    if (filters?.endDate) {
      params = params.set('endDate', filters.endDate);
    }

    if (filters?.status) {
      params = params.set('status', filters.status);
    }

    if (filters?.priority) {
      params = params.set('priority', filters.priority);
    }

    this.http.get<ApiResponse<Operation>>(this.apiUrl, { params })
      .pipe(
        catchError(error => {
          console.error('Error loading operations:', error);
          this.errorSubject.next('Failed to load operations. Please try again.');
          return of({ 
            Response: { items: [], totalCount: 0 }, 
            Success: false, 
            ErrorMessage: error.message 
          } as ApiResponse<Operation>);
        }),
        tap(() => this.loadingSubject.next(false))
      )
      .subscribe(response => {
        this.operationsSubject.next(response.Response?.items || []);
      });
  }

  getOperationById(id: string): Observable<Operation | undefined> {
    return this.operations$.pipe(
      map(operations => operations.find(operation => operation.operationId === id))
    );
  }
} 