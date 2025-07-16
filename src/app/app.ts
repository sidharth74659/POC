import { Component } from '@angular/core';
import { ChangeDetectionComponent } from './change-detection/change-detection.component';
import { SubjectVsBehaviorSubjectDemoComponent } from './subject-vs-behaviorsubject-demo/subject-vs-behaviorsubject-demo.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TodoDemoComponent } from './todo-demo/todo-demo.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [ChangeDetectionComponent, SubjectVsBehaviorSubjectDemoComponent, CommonModule, HttpClientModule, TodoDemoComponent],
  styleUrls: ['./app.scss']
})
export class App {
  title = 'angular-concepts';
  concepts = [
    {
      name: 'Change Detection',
      description: 'Change Detection is a mechanism that Angular uses to detect changes in the data and update the UI accordingly.'
    },
    {
      name: 'Subject vs BehaviourSubject',
      description: 'Subject is a simple observable that can be used to emit values. BehaviourSubject is a subject that can be used to emit values and store the last value.'
    },
    {
      name: 'Todo Demo',
      description: 'Todo Demo is a demo that shows how to use the TodoService to get and add todos.'
    }
  ];

  selectedConceptIndex = 0;

  selectConcept(index: number) {
    this.selectedConceptIndex = index;
  }
}
