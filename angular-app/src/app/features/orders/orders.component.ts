import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="orders-container">
      <h1>Orders</h1>
      <p>Orders management coming soon...</p>
    </div>
  `,
  styles: [`
    .orders-container {
      padding: 2rem;
      text-align: center;
    }
  `]
})
export class OrdersComponent {} 