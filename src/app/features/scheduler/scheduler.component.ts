import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceService } from '../../shared/services/resource.service';
import { OperationService } from '../../shared/services/operation.service';
import { Resource } from '../../shared/models/resource.model';
import { Operation } from '../../shared/models/operation.model';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { FilterComponent } from './filter/filter.component';
import { SchedulerTableComponent, ScheduleRow } from './scheduler-table/scheduler-table.component';
import { ChatComponent } from '../chat/chat.component';

export interface ResourceFilters {
  skillSet?: string;
  role?: string;
  name?: string;
  availability?: string;
}

export interface OperationFilters {
  resourceId?: string;
  equipment?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  priority?: string;
}

@Component({
  selector: 'app-scheduler',
  standalone: true,
  imports: [CommonModule, FilterComponent, SchedulerTableComponent, ChatComponent],
  template: `
    <div class="scheduler-container p-4 max-w-[1200px] mx-auto">
      <h2 class="text-xl font-bold mb-4">Resource Scheduler</h2>
      
      <app-filter 
        (resourceFiltersChanged)="onResourceFiltersChanged($event)"
        (operationFiltersChanged)="onOperationFiltersChanged($event)"
      ></app-filter>
      
      <div class="scheduler-table-wrapper">
        <app-scheduler-table
          [rows]="scheduleRows$ | async"
          [isLoading]="(isLoading$ | async) ?? false"
          (askAI)="onAskAI($event)"
        ></app-scheduler-table>
      </div>
      
      <app-chat
        *ngIf="selectedResource"
        [resourceContext]="selectedResource"
        [isOpen]="isChatOpen"
        (closed)="onChatClosed()"
      ></app-chat>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulerComponent implements OnInit {
  resources$!: Observable<Resource[]>;
  operations$!: Observable<Operation[]>;
  resourcesLoading$!: Observable<boolean>;
  operationsLoading$!: Observable<boolean>;
  isLoading$!: Observable<boolean>;
  scheduleRows$!: Observable<ScheduleRow[]>;
  
  selectedResource: Resource | null = null;
  isChatOpen: boolean = false;
  
  private resourceFiltersSubject = new BehaviorSubject<ResourceFilters>({});
  private operationFiltersSubject = new BehaviorSubject<OperationFilters | null>(null);

  constructor(
    private resourceService: ResourceService,
    private operationService: OperationService
  ) {}

  ngOnInit(): void {
    this.resources$ = this.resourceService.resources$;
    this.resourcesLoading$ = this.resourceService.loading$;
    this.operations$ = this.operationService.operations$;
    this.operationsLoading$ = this.operationService.loading$;
    
    // Combine loading states
    this.isLoading$ = combineLatest([
      this.resourcesLoading$,
      this.operationsLoading$
    ]).pipe(
      map(([resourcesLoading, operationsLoading]) => Boolean(resourcesLoading || operationsLoading))
    );
    
    // Create schedule rows by combining resources and operations
    this.scheduleRows$ = combineLatest([
      this.resources$,
      this.operations$
    ]).pipe(
      map(([resources, operations]) => {
        return resources.map(resource => {
          const resourceOperations = operations.filter(op => 
            op.resourceId === resource.resourceId
          );
          
          return {
            resource,
            operations: resourceOperations,
            isAvailable: true // Set default as available since our model doesn't track this
          };
        });
      })
    );
    
    // Subscribe to filter changes
    this.resourceFiltersSubject.subscribe(filters => {
      this.resourceService.loadResources(filters);
    });
    
    // Load initial resources and operations
    this.resourceService.loadResources();
    this.operationService.loadOperations();
  }
  
  onResourceFiltersChanged(filters: ResourceFilters): void {
    this.resourceFiltersSubject.next(filters);
    this.resourceService.loadResources(filters);
  }
  
  onOperationFiltersChanged(filters: OperationFilters): void {
    this.operationFiltersSubject.next(filters);
    this.operationService.loadOperations(filters);
  }
  
  onAskAI(resource: Resource): void {
    this.selectedResource = resource;
    this.isChatOpen = true;
  }
  
  onChatClosed(): void {
    this.isChatOpen = false;
    setTimeout(() => {
      this.selectedResource = null;
    }, 300); // small delay for animation
  }
} 