import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperationService } from '../../core/services/operation.service';
import { ResourceService } from '../../core/services/resource.service';
import { Operation, Resource } from '../../core/services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="operations-container">
      <h2 class="text-xl font-bold mb-4">Operations Management</h2>
      
      <div class="mb-4">
        <p class="text-sm mb-2">Manage operations that need to be scheduled for resources.</p>
      </div>
      
      <div class="resource-selector mb-4">
        <h3 class="text-lg font-medium mb-2">Select Resource</h3>
        <div class="loading-indicator" *ngIf="resourcesLoading$ | async">
          Loading resources...
        </div>
        
        <div class="error-message" *ngIf="resourcesError$ | async as error">
          <div class="p-3 bg-red-100 text-red-700 rounded-md">{{ error }}</div>
        </div>
        
        <div class="resource-list" *ngIf="(resources$ | async)?.length">
          <select 
            class="w-full p-2 border rounded-md"
            (change)="onResourceSelect($event)"
          >
            <option value="">Select a resource</option>
            <option *ngFor="let resource of resources$ | async" [value]="resource.resourceId">
              {{ resource.resourceName }} ({{ resource.role }})
            </option>
          </select>
        </div>
      </div>
      
      <div *ngIf="selectedResourceId" class="operations-list">
        <h3 class="text-lg font-medium mb-2">Operations for Selected Resource</h3>
        
        <div class="loading-indicator" *ngIf="operationsLoading$ | async">
          Loading operations...
        </div>
        
        <div class="error-message" *ngIf="operationsError$ | async as error">
          <div class="p-3 bg-red-100 text-red-700 rounded-md">{{ error }}</div>
        </div>
        
        <div *ngIf="(operations$ | async)?.length; else noOperations" class="grid grid-cols-1 gap-4">
          <div *ngFor="let operation of operations$ | async" class="operation-card p-4 border rounded-md bg-white shadow-sm">
            <div class="operation-header">
              <h4 class="text-lg font-medium">{{ operation.operationName }}</h4>
            </div>
            <div class="operation-details mt-2">
              <div class="mt-1"><span class="text-gray-600">ID:</span> {{ operation.operationId }}</div>
              <div class="mt-1"><span class="text-gray-600">Equipment:</span> {{ operation.equipment }}</div>
              <div class="mt-1"><span class="text-gray-600">Work Order:</span> {{ operation.workOrderNumber }}</div>
              <div class="mt-1"><span class="text-gray-600">Start Date:</span> {{ operation.startDate | date }}</div>
              <div class="mt-1"><span class="text-gray-600">End Date:</span> {{ operation.endDate | date }}</div>
              <div class="mt-1" *ngIf="operation.notes"><span class="text-gray-600">Notes:</span> {{ operation.notes }}</div>
            </div>
          </div>
        </div>
        
        <ng-template #noOperations>
          <div *ngIf="!(operationsLoading$ | async)" class="no-operations p-4 border rounded-md bg-gray-50 text-center">
            <p>No operations available for the selected resource.</p>
          </div>
        </ng-template>
      </div>
      
      <div *ngIf="!selectedResourceId && !(resourcesLoading$ | async) && (resources$ | async)?.length" class="no-selection p-4 border rounded-md bg-gray-50 text-center mt-4">
        <p>Please select a resource to view its operations.</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperationsComponent implements OnInit {
  resources$!: Observable<Resource[]>;
  operations$!: Observable<Operation[]>;
  resourcesLoading$!: Observable<boolean>;
  operationsLoading$!: Observable<boolean>;
  resourcesError$!: Observable<string | null>;
  operationsError$!: Observable<string | null>;
  selectedResourceId: string | null = null;
  
  constructor(
    private operationService: OperationService,
    private resourceService: ResourceService
  ) {}

  ngOnInit(): void {
    this.resources$ = this.resourceService.resources$;
    this.resourcesLoading$ = this.resourceService.loading$;
    this.resourcesError$ = this.resourceService.error$;
    
    this.operations$ = this.operationService.operations$;
    this.operationsLoading$ = this.operationService.loading$;
    this.operationsError$ = this.operationService.error$;
    
    // Load resources when component initializes
    setTimeout(() => this.resourceService.loadResources(), 0);
  }
  
  onResourceSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedResourceId = select.value;
    
    if (this.selectedResourceId) {
      this.operationService.loadOperations({ resourceId: this.selectedResourceId });
    }
  }
} 