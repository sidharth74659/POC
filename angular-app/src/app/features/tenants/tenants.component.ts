import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tenants',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tenants-container">
      <h1>Tenants</h1>
      <p>Tenant management coming soon...</p>
    </div>
  `,
  styles: [`
    .tenants-container {
      padding: 2rem;
      text-align: center;
    }
  `]
})
export class TenantsComponent {} 