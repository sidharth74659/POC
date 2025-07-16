import { AsyncPipe, NgFor } from "@angular/common";
import { Component, Injectable } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BehaviorSubject, Observable, of, Subscription } from "rxjs";
import { DEFAULT_TODOS } from "./todos.constant";
import { ITodo } from "./todos.interace";


@Injectable({
    providedIn: 'root'
})
export class TodoTwoService {
    private _todos = new BehaviorSubject<ITodo[]>(DEFAULT_TODOS);
    todos$ = this._todos.asObservable();

    getTodos() {
        return this.todos$;
    }

    addTodo(todo: ITodo) {
        this._todos.next([...this._todos.getValue(), todo]);
    }

    updateTodo(todo: ITodo) {
        this._todos.next(this._todos.getValue().map(t => t.id === todo.id ? todo : t));
    }

    removeTodo(id: number) {
        this._todos.next(this._todos.getValue().filter(todo => todo.id !== id));
    }
}

@Component({
    selector: 'app-todo-two',
    standalone: true,
    imports: [NgFor, FormsModule, AsyncPipe],
    template: `
    <div>
      <h2>Todo List</h2>
  
      <div>
      <input [(ngModel)]="newTodo" placeholder="Add a new todo" />
      <button (click)="addTodo()">Add</button>
      </div>
  
      <ul>  
        <li *ngFor="let todo of todos | async; let i = index">
          <span>{{ i + 1 }}.</span>
          <input type="checkbox" [(ngModel)]="todo.checked" (change)="updateTodo(todo)" />
          {{ todo.title }}
          <button (click)="removeTodo(todo.id)">Remove</button>
        </li>
      </ul>
      <div>
        <h3>Total Todos: {{ (todos | async)?.length }}</h3>
      </div>
    </div>
    `
})
export class TodoTwoComponent {
    newTodo: string = '';
    todos: Observable<ITodo[]> = of([]);

    constructor(private todoTwoService: TodoTwoService) {
        this.todos = this.todoTwoService.getTodos();
    }

    removeTodo(id: number) {
        this.todoTwoService.removeTodo(id);
    }

    addTodo() {
        this.todoTwoService.addTodo({
            id: Math.random(),
            title: this.newTodo || 'Random Title ' + Math.random(),
            checked: false
        });
    }

    updateTodo(todo: ITodo) {
        this.todoTwoService.updateTodo(todo);
    }

}
