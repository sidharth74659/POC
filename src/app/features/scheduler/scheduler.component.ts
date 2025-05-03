import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceService } from '../../core/services/resource.service';
import { OperationService } from '../../core/services/operation.service';
import { Resource, Operation } from '../../core/services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-scheduler',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scheduler-container">
      <h2 class="text-xl font-bold mb-4">Resource Scheduler</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="resources-panel">
          <h3 class="text-lg font-semibold mb-2">Available Resources</h3>
          <div class="resource-list">
            <div *ngIf="resources$ | async as resources">
              <div *ngIf="resources.length; else noResources">
                <div *ngFor="let resource of resources" class="resource-item p-2 border rounded mb-2">
                  <div class="font-medium">{{ resource.resourceName }}</div>
                  <div class="text-sm">Role: {{ resource.role }}</div>
                  <div class="text-sm">Skills: {{ resource.skillSet }}</div>
                </div>
              </div>
              <ng-template #noResources>
                <p>No resources available</p>
              </ng-template>
            </div>
          </div>
        </div>
        
        <div class="operations-panel">
          <h3 class="text-lg font-semibold mb-2">Pending Operations</h3>
          <div class="operation-list">
            <div *ngIf="operations$ | async as operations">
              <div *ngIf="operations.length; else noOperations">
                <div *ngFor="let operation of operations" class="operation-item p-2 border rounded mb-2">
                  <div class="font-medium">{{ operation.operationName }}</div>
                  <div class="text-sm">Equipment: {{ operation.equipment }}</div>
                  <div class="text-sm">Period: {{ operation.startDate | date }} - {{ operation.endDate | date }}</div>
                </div>
              </div>
              <ng-template #noOperations>
                <p>No pending operations</p>
              </ng-template>
            </div>
          </div>
        </div>
      </div>
      
      <div class="schedule-panel mt-4">
        <h3 class="text-lg font-semibold mb-2">Current Schedule</h3>
        <p class="text-sm text-gray-500">Scheduling functionality will be implemented in the next iteration.</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulerComponent implements OnInit {
  resources$!: Observable<Resource[]>;
  operations$!: Observable<Operation[]>;

  constructor(
    private resourceService: ResourceService,
    private operationService: OperationService
  ) {}

  ngOnInit(): void {
    this.resources$ = this.resourceService.resources$;
    this.operations$ = this.operationService.operations$;
    
    // Load resources with a small delay to avoid circular dependency
    setTimeout(() => {
      this.resourceService.loadResources();
    }, 0);
  }
} 