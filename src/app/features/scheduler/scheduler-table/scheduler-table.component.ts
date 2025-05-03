import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resource } from '../../../shared/models/resource.model';
import { Operation } from '../../../shared/models/operation.model';

export interface ScheduleRow {
  resource: Resource;
  operations: Operation[];
  isAvailable: boolean;
}

@Component({
  selector: 'app-scheduler-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-x-auto">
      <table class="scheduler-table w-full">
        <thead>
          <tr class="bg-surface">
            <th class="p-3 text-left">Resource</th>
            <th class="p-3 text-left">Skillset</th>
            <th class="p-3 text-left">Time Slot</th>
            <th class="p-3 text-left">Operation</th>
            <th class="p-3 text-left">Equipment</th>
            <th class="p-3 text-left">Availability</th>
            <th class="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <ng-container *ngIf="rows?.length; else noData">
            <tr *ngFor="let row of rows" class="border-b border-divider hover:bg-surface transition-colors">
              <td class="p-3">
                <div class="font-medium">{{ row.resource.name }}</div>
                <div class="text-sm text-text-secondary">{{ row.resource.id }}</div>
              </td>
              <td class="p-3">
                <span class="text-sm">{{ row.resource.skillSet.join(', ') }}</span>
              </td>
              <td class="p-3">
                <ng-container *ngIf="row.operations?.length; else noOperations">
                  <div *ngFor="let operation of row.operations" class="text-sm mb-1">
                    {{ operation.startDate | date:'short' }} - {{ operation.endDate | date:'short' }}
                  </div>
                </ng-container>
                <ng-template #noOperations>
                  <span class="text-sm text-text-secondary">No scheduled time</span>
                </ng-template>
              </td>
              <td class="p-3">
                <ng-container *ngIf="row.operations?.length; else noOperations">
                  <div *ngFor="let operation of row.operations" class="text-sm mb-1">
                    {{ operation.title }}
                  </div>
                </ng-container>
                <ng-template #noOperations>
                  <span class="text-sm text-text-secondary">No operations</span>
                </ng-template>
              </td>
              <td class="p-3">
                <ng-container *ngIf="row.operations?.length; else noOperations">
                  <div *ngFor="let operation of row.operations" class="text-sm mb-1">
                    {{ operation.equipment }}
                  </div>
                </ng-container>
                <ng-template #noOperations>
                  <span class="text-sm text-text-secondary">N/A</span>
                </ng-template>
              </td>
              <td class="p-3">
                <span [ngClass]="{
                  'px-2 py-1 rounded-full text-xs flex items-center': true,
                  'bg-success bg-opacity-20 text-success': row.isAvailable,
                  'bg-warning bg-opacity-20 text-warning': row.resource.availability === 'busy',
                  'bg-error bg-opacity-20 text-error': row.resource.availability === 'unavailable'
                }">
                  <span class="h-2 w-2 rounded-full mr-1" 
                    [ngClass]="{
                      'bg-success': row.isAvailable,
                      'bg-warning': row.resource.availability === 'busy',
                      'bg-error': row.resource.availability === 'unavailable'
                    }"></span>
                  {{ row.resource.availability.charAt(0).toUpperCase() + row.resource.availability.slice(1) }}
                </span>
              </td>
              <td class="p-3">
                <button 
                  (click)="onAskAI(row.resource)"
                  class="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary-dark transition-colors"
                >
                  Ask AI
                </button>
              </td>
            </tr>
          </ng-container>
          <ng-template #noData>
            <tr>
              <td colspan="7" class="p-4 text-center text-text-secondary">
                <div *ngIf="isLoading; else noDataTemplate">
                  Loading schedule data...
                </div>
                <ng-template #noDataTemplate>
                  No schedule data available. Try adjusting your filters.
                </ng-template>
              </td>
            </tr>
          </ng-template>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .scheduler-table {
      border-collapse: collapse;
    }
    .scheduler-table th {
      position: sticky;
      top: 0;
      z-index: 1;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulerTableComponent {
  @Input() rows: ScheduleRow[] | null = [];
  @Input() isLoading: boolean = false;
  @Output() askAI = new EventEmitter<Resource>();
  
  onAskAI(resource: Resource): void {
    this.askAI.emit(resource);
  }
} 