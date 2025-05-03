import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';

/**
 * Standard API response envelope
 */
export interface ApiResponse<T> {
  response: T | null;
  success: boolean;
  errorMessage: string | null;
}

/**
 * Resource interface
 */
export interface Resource {
  resourceId: string;
  resourceName: string;
  skillSet: string;
  role: string;
}

/**
 * Operation interface
 */
export interface Operation {
  operationId: string;
  operationName: string;
  equipment: string;
  workOrderNumber: string;
  workOrderId: string;
  resourceId: string;
  startDate: string;
  endDate: string;
  notes: string;
}

/**
 * Filter parameters for resources
 */
export interface ResourceFilters {
  skillSet?: string;
  role?: string;
  name?: string;
  page?: number;
  size?: number;
}

/**
 * Filter parameters for operations
 */
export interface OperationFilters {
  resourceId: string;
  equipment?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Request body for AI chat
 */
export interface ChatRequest {
  userId: string;
  resourceContext: any;
  question: string;
}

/**
 * AI Chat response
 */
export interface ChatResponse {
  answer: string;
  followUps: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly delayMs = 800; // Simulate network delay

  constructor(private http: HttpClient) {}

  /**
   * Get resources with optional filters
   */
  getResources(filters?: ResourceFilters): Observable<ApiResponse<{ items: Resource[], totalCount: number }>> {
    // In a real app, this would be an HTTP call with query parameters
    return this.http.get<ApiResponse<{ items: Resource[], totalCount: number }>>('assets/data/resources.json').pipe(
      delay(this.delayMs),
      map(data => {
        if (!filters) return data;
        
        // Apply filters (this would normally be done by the backend)
        if (!data.response) {
          return {
            response: null,
            success: false,
            errorMessage: 'No resources data available'
          };
        }
        
        let filteredItems = data.response.items;
        
        if (filters.name) {
          filteredItems = filteredItems.filter((item: Resource) => 
            item.resourceName.toLowerCase().includes(filters.name!.toLowerCase())
          );
        }
        
        if (filters.skillSet) {
          filteredItems = filteredItems.filter((item: Resource) => 
            item.skillSet.toLowerCase().includes(filters.skillSet!.toLowerCase())
          );
        }
        
        if (filters.role) {
          filteredItems = filteredItems.filter((item: Resource) => 
            item.role.toLowerCase().includes(filters.role!.toLowerCase())
          );
        }
        
        // Apply pagination
        const page = filters.page || 1;
        const size = filters.size || 10;
        const start = (page - 1) * size;
        const paginatedItems = filteredItems.slice(start, start + size);
        
        return {
          response: {
            items: paginatedItems,
            totalCount: filteredItems.length
          },
          success: true,
          errorMessage: null
        };
      }),
      catchError(error => {
        console.error('Error fetching resources:', error);
        return of({
          response: null,
          success: false,
          errorMessage: 'Failed to fetch resources. Please try again later.'
        });
      })
    );
  }

  /**
   * Get operations with required filters
   */
  getOperations(filters: OperationFilters): Observable<ApiResponse<{ items: Operation[], totalCount: number }>> {
    if (!filters.resourceId) {
      return throwError(() => new Error('Resource ID is required'));
    }

    return this.http.get<ApiResponse<{ items: Operation[], totalCount: number }>>('assets/data/operations.json').pipe(
      delay(this.delayMs),
      map(data => {
        if (!data.response) {
          return {
            response: null,
            success: false,
            errorMessage: 'No operations data available'
          };
        }
        
        // Apply filters (this would normally be done by the backend)
        let filteredItems = data.response.items.filter((item: Operation) => 
          item.resourceId === filters.resourceId
        );
        
        if (filters.equipment) {
          filteredItems = filteredItems.filter((item: Operation) => 
            item.equipment.toLowerCase().includes(filters.equipment!.toLowerCase())
          );
        }
        
        if (filters.startDate) {
          const startDate = new Date(filters.startDate);
          filteredItems = filteredItems.filter((item: Operation) => 
            new Date(item.startDate) >= startDate
          );
        }
        
        if (filters.endDate) {
          const endDate = new Date(filters.endDate);
          filteredItems = filteredItems.filter((item: Operation) => 
            new Date(item.endDate) <= endDate
          );
        }
        
        if (filteredItems.length === 0) {
          return {
            response: null,
            success: false,
            errorMessage: 'No operations found matching the specified criteria.'
          };
        }
        
        return {
          response: {
            items: filteredItems,
            totalCount: filteredItems.length
          },
          success: true,
          errorMessage: null
        };
      }),
      catchError(error => {
        console.error('Error fetching operations:', error);
        return of({
          response: null,
          success: false,
          errorMessage: 'Failed to fetch operations. Please try again later.'
        });
      })
    );
  }

  /**
   * Post chat question to AI service
   */
  postChatQuestion(request: ChatRequest): Observable<ApiResponse<ChatResponse>> {
    if (!request.resourceContext || !request.question) {
      return throwError(() => new Error('Resource context and question are required'));
    }

    // Simulate AI service
    return this.http.get<any>('assets/data/ai-chat-responses.json').pipe(
      delay(this.delayMs * 1.5), // AI calls take longer
      map(data => {
        // Determine which response to return based on the question
        let responseKey = 'general';
        
        const questionLower = request.question.toLowerCase();
        if (questionLower.includes('next week')) {
          responseKey = 'next_week';
        } else if (questionLower.includes('available') || questionLower.includes('slot')) {
          responseKey = 'available_slots';
        } else if (questionLower.includes('conflict') || questionLower.includes('overlap')) {
          responseKey = 'equipment_conflicts';
        } else if (questionLower.includes('unavailable') || Math.random() < 0.05) { // 5% chance of failure for testing
          responseKey = 'ai_unavailable';
        }
        
        return data.responses[responseKey];
      }),
      catchError(error => {
        console.error('Error with AI service:', error);
        return of({
          response: null,
          success: false,
          errorMessage: 'AI service unavailable. Please try again later.'
        });
      })
    );
  }
} 