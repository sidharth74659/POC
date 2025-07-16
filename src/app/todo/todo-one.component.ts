import { NgFor } from "@angular/common";
import { Component, Injectable } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { of, Subscription } from "rxjs";
import { DEFAULT_TODOS } from "./todos.constant";
import { ITodo } from "./todos.interace";

@Injectable({
    providedIn: 'root'
})
export class TodoOneService {
    todos: ITodo[] = DEFAULT_TODOS;

    getTodos() {
        return of(this.todos);
    }

    addTodo(todo: ITodo) {
        this.todos.push(todo);
        return of(this.todos);
    }

    updateTodo(todo: ITodo) {
        this.todos = this.todos.map(t => t.id === todo.id ? todo : t);
        return of(this.todos);
    }

    removeTodo(id: number) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        return of(this.todos);
    }
}

@Component({
    selector: 'app-todo-one',
    standalone: true,
    imports: [NgFor, FormsModule],
    template: `
    <div>
      <h2>Todo List</h2>
  
      <div>
      <input [(ngModel)]="newTodo" placeholder="Add a new todo" />
      <button (click)="addTodo()">Add</button>
      </div>
  
      <ul>  
        <li *ngFor="let todo of todos; let i = index">
          <span>{{ i + 1 }}.</span>
          <input type="checkbox" [(ngModel)]="todo.checked" (change)="updateTodo(todo)" />
          {{ todo.title }}
          <button (click)="removeTodo(todo.id)">Remove</button>
        </li>
      </ul>
      <div>
        <h3>Total Todos: {{ todos.length }}</h3>
      </div>
    </div>
    `
})
export class TodoOneComponent {
    newTodo: string = '';
    todos: ITodo[] = [];

    private todoSubscription: Subscription = new Subscription();

    constructor(private todoOneService: TodoOneService) {
        this.loadTodos();
    }

    loadTodos() {
        this.todoSubscription = this.todoOneService.getTodos().subscribe(todos => {
            this.todos = todos;
        });
    }

    removeTodo(id: number) {
        this.todoOneService.removeTodo(id);
        this.loadTodos();
    }

    addTodo() {
        this.todoOneService.addTodo({
            id: Math.random(),
            title: this.newTodo || 'Random Title ' + Math.random(),
            checked: false
        });
        this.loadTodos();
    }

    updateTodo(todo: ITodo) {
        this.todoOneService.updateTodo(todo);
        this.loadTodos();
    }

    ngOnDestroy() {
        this.todoSubscription.unsubscribe();
    }
}
