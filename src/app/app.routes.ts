import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'scheduler',
    pathMatch: 'full'
  },
  {
    path: 'scheduler',
    loadComponent: () => import('./features/scheduler/scheduler.component').then(m => m.SchedulerComponent),
    title: 'Resource Scheduler'
  },
  {
    path: 'resources',
    loadComponent: () => import('./features/resources/resources.component').then(m => m.ResourcesComponent),
    title: 'Resources'
  },
  {
    path: 'operations',
    loadComponent: () => import('./features/operations/operations.component').then(m => m.OperationsComponent),
    title: 'Operations'
  },
  {
    path: '**',
    redirectTo: 'scheduler'
  }
];
