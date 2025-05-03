import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap } from 'rxjs';
import { ApiService, Resource, ResourceFilters } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private resourcesSubject = new BehaviorSubject<Resource[]>([]);
  private totalCountSubject = new BehaviorSubject<number>(0);
  private errorSubject = new BehaviorSubject<string | null>(null);

  loading$ = this.loadingSubject.asObservable();
  resources$ = this.resourcesSubject.asObservable();
  totalCount$ = this.totalCountSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(private apiService: ApiService) {}

  /**
   * Load resources with optional filters
   */
  loadResources(filters?: ResourceFilters): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.apiService.getResources(filters).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next(error.message || 'Failed to load resources');
        console.error('Error loading resources:', error);
        throw error;
      })
    ).subscribe(response => {
      if (response.success && response.response) {
        this.resourcesSubject.next(response.response.items);
        this.totalCountSubject.next(response.response.totalCount);
      } else {
        this.resourcesSubject.next([]);
        this.totalCountSubject.next(0);
        this.errorSubject.next(response.errorMessage || 'Failed to load resources');
      }
    });
  }

  /**
   * Get a resource by ID
   */
  getResourceById(resourceId: string): Observable<Resource | undefined> {
    return this.resources$.pipe(
      map(resources => resources.find(resource => resource.resourceId === resourceId))
    );
  }

  /**
   * Clear all resources data
   */
  clearResources(): void {
    this.resourcesSubject.next([]);
    this.totalCountSubject.next(0);
    this.errorSubject.next(null);
  }
} 