import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChangeDetectionComponent } from './change-detection/change-detection.component';
import { SubjectVsBehaviorSubjectDemoComponent } from './subject-vs-behaviorsubject-demo/subject-vs-behaviorsubject-demo.component';
import { TodoOneComponent } from './todo/todo-one.component';
import { TodoTwoComponent } from './todo/todo-two.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  imports: [
    ChangeDetectionComponent,
    SubjectVsBehaviorSubjectDemoComponent,
    CommonModule,
    TodoOneComponent,
    TodoTwoComponent,
  ],
  styleUrls: ['./app.scss'],
})
export class App {
  title = 'angular-concepts';
  concepts = [
    {
      name: 'Change Detection',
      description:
        'Change Detection is a mechanism that Angular uses to detect changes in the data and update the UI accordingly.',
    },
    {
      name: 'Subject vs BehaviourSubject',
      description:
        'Subject is a simple observable that can be used to emit values. BehaviourSubject is a subject that can be used to emit values and store the last value.',
    },
    {
      name: 'Todo: With & Without Subjects',
      description:
        'Todo: With & Without Subjects is a demo that shows how the code is redundant without Subjects.',
    },
    /* 
     {
       name: 'Todo Demo',
       description: 'Todo Demo is a demo that shows how to use the TodoService to get and add todos.'
     }
       */
  ];

  selectedConceptIndex = 0;

  selectConcept(index: number) {
    this.selectedConceptIndex = index;
  }
}
