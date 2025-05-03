import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap } from 'rxjs';
import { ApiService, Operation, OperationFilters } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class OperationService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private operationsSubject = new BehaviorSubject<Operation[]>([]);
  private totalCountSubject = new BehaviorSubject<number>(0);
  private errorSubject = new BehaviorSubject<string | null>(null);

  loading$ = this.loadingSubject.asObservable();
  operations$ = this.operationsSubject.asObservable();
  totalCount$ = this.totalCountSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(private apiService: ApiService) {}

  /**
   * Load operations with required filters
   */
  loadOperations(filters: OperationFilters): void {
    if (!filters.resourceId) {
      this.errorSubject.next('Resource ID is required to load operations');
      return;
    }

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.apiService.getOperations(filters).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next(error.message || 'Failed to load operations');
        console.error('Error loading operations:', error);
        throw error;
      })
    ).subscribe(response => {
      if (response.success && response.response) {
        this.operationsSubject.next(response.response.items);
        this.totalCountSubject.next(response.response.totalCount);
      } else {
        this.operationsSubject.next([]);
        this.totalCountSubject.next(0);
        this.errorSubject.next(response.errorMessage || 'Failed to load operations');
      }
    });
  }

  /**
   * Get operation by ID
   */
  getOperationById(operationId: string): Observable<Operation | undefined> {
    return this.operations$.pipe(
      map(operations => operations.find(operation => operation.operationId === operationId))
    );
  }

  /**
   * Get operations by equipment type
   */
  getOperationsByEquipment(equipment: string): Observable<Operation[]> {
    return this.operations$.pipe(
      map(operations => operations.filter(operation => 
        operation.equipment.toLowerCase().includes(equipment.toLowerCase())
      ))
    );
  }

  /**
   * Get operations within a date range
   */
  getOperationsInDateRange(startDate: Date, endDate: Date): Observable<Operation[]> {
    return this.operations$.pipe(
      map(operations => operations.filter(operation => {
        const opStart = new Date(operation.startDate);
        const opEnd = new Date(operation.endDate);
        return opStart >= startDate && opEnd <= endDate;
      }))
    );
  }

  /**
   * Clear all operations data
   */
  clearOperations(): void {
    this.operationsSubject.next([]);
    this.totalCountSubject.next(0);
    this.errorSubject.next(null);
  }
} 