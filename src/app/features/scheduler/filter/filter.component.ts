import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ResourceFilters, OperationFilters } from '../scheduler.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="filter-container p-4 bg-surface rounded-md shadow-sm mb-4">
      <h3 class="text-lg font-medium mb-3">Filters</h3>
      
      <form [formGroup]="filterForm" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Resource Name Filter -->
        <div class="form-group">
          <label for="name" class="block text-sm font-medium text-text-secondary mb-1">Resource Name</label>
          <input 
            type="text" 
            id="name" 
            formControlName="name" 
            class="w-full p-2 border border-divider rounded-md focus:outline-none focus:border-primary"
            placeholder="Search by name"
          >
        </div>
        
        <!-- Role Filter -->
        <div class="form-group">
          <label for="role" class="block text-sm font-medium text-text-secondary mb-1">Role</label>
          <select 
            id="role" 
            formControlName="role" 
            class="w-full p-2 border border-divider rounded-md focus:outline-none focus:border-primary"
          >
            <option value="">All Roles</option>
            <option value="Senior Technician">Senior Technician</option>
            <option value="Field Engineer">Field Engineer</option>
            <option value="Systems Engineer">Systems Engineer</option>
            <option value="Maintenance Specialist">Maintenance Specialist</option>
            <option value="Lead Technician">Lead Technician</option>
          </select>
        </div>
        
        <!-- Skillset Filter -->
        <div class="form-group">
          <label for="skillSet" class="block text-sm font-medium text-text-secondary mb-1">Skillset</label>
          <select 
            id="skillSet" 
            formControlName="skillSet" 
            class="w-full p-2 border border-divider rounded-md focus:outline-none focus:border-primary"
          >
            <option value="">All Skills</option>
            <option value="electrical">Electrical</option>
            <option value="mechanical">Mechanical</option>
            <option value="installation">Installation</option>
            <option value="networking">Networking</option>
            <option value="hydraulics">Hydraulics</option>
            <option value="software">Software</option>
            <option value="robotics">Robotics</option>
          </select>
        </div>
        
        <!-- Equipment Filter -->
        <div class="form-group">
          <label for="equipment" class="block text-sm font-medium text-text-secondary mb-1">Equipment</label>
          <input 
            type="text" 
            id="equipment" 
            formControlName="equipment" 
            class="w-full p-2 border border-divider rounded-md focus:outline-none focus:border-primary"
            placeholder="Search by equipment"
          >
        </div>
        
        <!-- Date Range Filter -->
        <div class="form-group">
          <label for="startDate" class="block text-sm font-medium text-text-secondary mb-1">Start Date</label>
          <input 
            type="date" 
            id="startDate" 
            formControlName="startDate" 
            class="w-full p-2 border border-divider rounded-md focus:outline-none focus:border-primary"
          >
        </div>
        
        <div class="form-group">
          <label for="endDate" class="block text-sm font-medium text-text-secondary mb-1">End Date</label>
          <input 
            type="date" 
            id="endDate" 
            formControlName="endDate" 
            class="w-full p-2 border border-divider rounded-md focus:outline-none focus:border-primary"
          >
        </div>
        
        <!-- Status Filter -->
        <div class="form-group">
          <label for="status" class="block text-sm font-medium text-text-secondary mb-1">Status</label>
          <select 
            id="status" 
            formControlName="status" 
            class="w-full p-2 border border-divider rounded-md focus:outline-none focus:border-primary"
          >
            <option value="">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <!-- Filter Controls -->
        <div class="form-group flex items-end">
          <button 
            type="button" 
            (click)="clearFilters()" 
            class="p-2 border border-divider rounded-md text-text-secondary hover:bg-gray-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent implements OnInit {
  @Output() resourceFiltersChanged = new EventEmitter<ResourceFilters>();
  @Output() operationFiltersChanged = new EventEmitter<OperationFilters>();
  
  filterForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      name: [''],
      role: [''],
      skillSet: [''],
      equipment: [''],
      startDate: [''],
      endDate: [''],
      status: ['']
    });
  }
  
  ngOnInit(): void {
    // Add debounce to avoid too many filter events
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
      )
      .subscribe(() => {
        // Automatic filtering on each change
        this.applyFilters();
      });
  }
  
  applyFilters(): void {
    const formValues = this.filterForm.value;
    
    // Emit resource filters
    const resourceFilters: ResourceFilters = {
      name: formValues.name || undefined,
      role: formValues.role || undefined
    };
    
    // Handle skillSet as array
    if (formValues.skillSet) {
      resourceFilters.skillSet = [formValues.skillSet];
    }
    
    this.resourceFiltersChanged.emit(resourceFilters);
    
    // Emit operation filters
    const operationFilters: OperationFilters = {
      equipment: formValues.equipment || undefined,
      startDate: formValues.startDate || undefined,
      endDate: formValues.endDate || undefined,
      status: formValues.status || undefined
    };
    
    this.operationFiltersChanged.emit(operationFilters);
  }
  
  clearFilters(): void {
    this.filterForm.reset();
    this.applyFilters();
  }
} 