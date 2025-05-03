import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceService } from '../../core/services/resource.service';
import { Resource } from '../../core/services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="resources-container">
      <h2 class="text-xl font-bold mb-4">Resources Management</h2>
      
      <div class="mb-4">
        <p class="text-sm mb-2">Manage human resources available for scheduling operations.</p>
      </div>
      
      <div class="loading-indicator" *ngIf="loading$ | async">
        Loading resources...
      </div>
      
      <div class="error-message" *ngIf="error$ | async as error">
        <div class="p-3 bg-red-100 text-red-700 rounded-md">{{ error }}</div>
      </div>
      
      <div class="resources-list mt-4">
        <div *ngIf="(resources$ | async)?.length; else noResources" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div *ngFor="let resource of resources$ | async" class="resource-card p-4 border rounded-md bg-white shadow-sm">
            <div class="resource-header">
              <h3 class="text-lg font-medium">{{ resource.resourceName }}</h3>
            </div>
            <div class="resource-details mt-2">
              <div class="mt-1"><span class="text-gray-600">ID:</span> {{ resource.resourceId }}</div>
              <div class="mt-1"><span class="text-gray-600">Role:</span> {{ resource.role }}</div>
              <div class="mt-1"><span class="text-gray-600">Skills:</span> {{ resource.skillSet }}</div>
            </div>
          </div>
        </div>
        
        <ng-template #noResources>
          <div class="no-resources p-4 border rounded-md bg-gray-50 text-center">
            <p>No resources available. Resources will be displayed here once added.</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcesComponent implements OnInit {
  resources$!: Observable<Resource[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  constructor(private resourceService: ResourceService) {}

  ngOnInit(): void {
    this.resources$ = this.resourceService.resources$;
    this.loading$ = this.resourceService.loading$;
    this.error$ = this.resourceService.error$;
    
    // Load resources when component initializes
    setTimeout(() => this.resourceService.loadResources(), 0);
  }
} 