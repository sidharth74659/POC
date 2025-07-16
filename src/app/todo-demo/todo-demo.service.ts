import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, switchMap, tap } from 'rxjs';
import { ITodo, ITodoPayload } from './todo-demo.interface';

@Injectable({
  providedIn: 'root',
})
export class TodoDemoService {
/* 
  private todosSubject = new BehaviorSubject<ITodo[]>([] as ITodo[]);

  constructor(private http: HttpClient) {
    this.loadDefaultTodos();
  }

  loadDefaultTodos() {
    localStorage.setItem('todos', JSON.stringify([
      {
        userId: 1,
        id: 1,
        title: 'Todo 1',
        completed: false,
      },
      {
        userId: 1,
        id: 2,
        title: 'Todo 2',
        completed: false,
      },
    ]));

    this.todosSubject.next(JSON.parse(localStorage.getItem('todos') || '[]'));
  }

  getTodos(): Observable<ITodo[]> {
    return this.todosSubject.asObservable();
  }

  addTodo(todo: ITodoPayload): Observable<ITodo> {
    const newTodo: ITodo = {
      userId: todo.userId,
      id: Math.random(),
      title: todo.title,
      completed: false,
    };

    const currentTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    currentTodos.push(newTodo);

    localStorage.setItem('todos', JSON.stringify(currentTodos));
    this.todosSubject.next(currentTodos);

    return of(newTodo);
  }
 */
  

  private todosSubject = new BehaviorSubject<ITodo[]>([] as ITodo[]);
  todos$ = this.todosSubject.asObservable();

  private triggerFetchTodos = new Subject<void>();

//   readonly API_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=10';
  readonly API_URL = 'http://localhost:5050/todos';

  constructor(private http: HttpClient) {
    // this.triggerFetchTodos.next();

    this.triggerFetchTodos.pipe(
      switchMap(() => this.getTodos())
    ).subscribe();
  }


  getTodos(): Observable<ITodo[]> {
    /* 
    return this.triggerFetchTodos.pipe(
      switchMap(() => this.http.get<ITodo[]>(this.API_URL)),
      tap(todos => this.todosSubject.next(todos))
    );
     */
    console.log('getTodos');
    return this.http.get<ITodo[]>(this.API_URL).pipe(
      tap(todos => this.todosSubject.next(todos))
    );
  }

  addTodo(todo: ITodoPayload) {
    console.log('addTodo', todo); 
    this.http.post<ITodo>(this.API_URL, {
      userId: 1,
      title: todo.title,
      completed: false
    }).pipe(
      tap(() => this.triggerFetchTodos.next())
    ).subscribe();
  }
  
}
