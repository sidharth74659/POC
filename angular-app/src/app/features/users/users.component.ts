import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="users-container">
      <h1>Users</h1>
      <p>User management coming soon...</p>
    </div>
  `,
  styles: [`
    .users-container {
      padding: 2rem;
      text-align: center;
    }
  `]
})
export class UsersComponent {} 