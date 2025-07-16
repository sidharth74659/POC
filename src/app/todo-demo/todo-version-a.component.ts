import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ITodo } from './todo-demo.interface';
import { TodoDemoService } from './todo-demo.service';

@Component({
  selector: 'todo-version-a',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 1rem; border: 1px solid #ccc; border-radius: 8px; background: #f9f9f9;">
      <h3>Version A: No Subject/BehaviorSubject</h3>
      <form (submit)="addTodo(newTodo.value); newTodo.value=''; $event.preventDefault();">
        <input #newTodo type="text" placeholder="Add todo" />
        <button type="submit">Add</button>
      </form>
      <ul>
        <li *ngFor="let todo of todos | async">
          <input type="checkbox" [checked]="todo.completed" disabled />
          {{ todo.title }}
        </li>
      </ul>
      <div style="margin-top:1rem; background:#fff3cd; padding:0.5rem; border-radius:4px;">
        <b>Edge Case:</b> If you add a todo, the list is refreshed from the server. But if the server is slow or fails, the UI may not update as expected.
      </div>
      <div style="margin-top:0.5rem; font-size:0.9em; color:#888;">(Manual refresh after POST)</div>
    </div>
  `
})
export class TodoVersionAComponent {
  todos: Observable<ITodo[]> = of([] as ITodo[]);

  constructor(private todoService: TodoDemoService) {
    this.fetchTodos();
  }

  fetchTodos() {
    this.todoService.getTodos().subscribe(todos => {
      this.todos = of(todos);
    });
  }

  addTodo(title: string) {
    if (!title.trim()) return;
    this.todoService.addTodo({
      userId: 1,
      id: 0,
      title,
      completed: false
    });
  }
} 