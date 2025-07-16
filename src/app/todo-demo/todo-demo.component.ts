import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoVersionAComponent } from './todo-version-a.component';
import { TodoVersionBComponent } from './todo-version-b.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'todo-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoVersionAComponent, TodoVersionBComponent],
  template: `
    <div style="margin-bottom: 1rem; display: flex; gap: 1rem;">
      <label><input type="checkbox" [(ngModel)]="showA" /> Show Version A (No Subject/BehaviorSubject)</label>
      <label><input type="checkbox" [(ngModel)]="showB" /> Show Version B (With BehaviorSubject)</label>
    </div>
    <div style="display: flex; gap: 2rem; align-items: flex-start;">
      <div style="flex: 1; min-width: 320px;" *ngIf="showA">
        <todo-version-a></todo-version-a>
      </div>
      <div style="flex: 1; min-width: 320px;" *ngIf="showB">
        <todo-version-b></todo-version-b>
      </div>
    </div>
    <div style="margin-top:2rem; background:#f1f8e9; border-radius:8px; padding:1rem; font-size:0.98rem;">
      <h3>Comparison Guide</h3>
      <ul>
        <li><b>Version A</b>: Uses only local variables. After adding a todo, the list is refreshed by re-calling the API. State is not reactive.</li>
        <li><b>Version B</b>: Uses <code>BehaviorSubject</code> for state. After adding a todo, the subject is updated, and all subscribers see the change instantly.</li>
        <li>Try adding todos in both versions and observe how the UI updates. Try toggling visibility to see how state is managed.</li>
        <li>Edge cases and inline comments are provided in each version for clarity.</li>
      </ul>
    </div>
  `
})
export class TodoDemoComponent {
  showA = true;
  showB = true;
} 