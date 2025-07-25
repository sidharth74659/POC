import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="access-denied-container">
      <h1>Access Denied</h1>
      <p>You don't have permission to access this resource.</p>
    </div>
  `,
  styles: [`
    .access-denied-container {
      padding: 2rem;
      text-align: center;
    }
  `]
})
export class AccessDeniedComponent {} 