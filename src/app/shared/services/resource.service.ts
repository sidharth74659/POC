import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { Resource } from '../models/resource.model';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private apiUrl = `${environment.apiUrl}/resources`;
  private resourcesSubject = new BehaviorSubject<Resource[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  resources$ = this.resourcesSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadResources(filters?: {
    skillSet?: string;
    role?: string;
    name?: string;
    availability?: string;
  }): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    let params = new HttpParams();
    
    if (filters?.skillSet) {
      params = params.set('skillSet', filters.skillSet);
    }
    
    if (filters?.role) {
      params = params.set('role', filters.role);
    }
    
    if (filters?.name) {
      params = params.set('name', filters.name);
    }
    
    if (filters?.availability) {
      params = params.set('availability', filters.availability);
    }

    this.http.get<ApiResponse<Resource>>(this.apiUrl, { params })
      .pipe(
        catchError(error => {
          console.error('Error loading resources:', error);
          this.errorSubject.next('Failed to load resources. Please try again.');
          return of({
            Response: { items: [], totalCount: 0 },
            Success: false,
            ErrorMessage: 'Failed to load resources'
          } as ApiResponse<Resource>);
        }),
        tap(() => this.loadingSubject.next(false))
      )
      .subscribe(response => {
        this.resourcesSubject.next(response.Response?.items || []);
      });
  }

  getResourceById(resourceId: string): Observable<Resource | undefined> {
    return this.resources$.pipe(
      map(resources => resources.find(resource => resource.resourceId === resourceId))
    );
  }
}