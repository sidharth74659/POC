import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';

/**
 * This component demonstrates the difference between Subject and BehaviorSubject
 * in RxJS, using a two-column layout. It highlights edge cases and provides
 * inline guides for each scenario.
 */
@Component({
  selector: 'app-subject-vs-behaviorsubject-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subject-vs-behaviorsubject-demo.component.html',
  styleUrls: ['./subject-vs-behaviorsubject-demo.component.scss']
})
export class SubjectVsBehaviorSubjectDemoComponent implements OnInit, OnDestroy {
  // --- Subject Demo ---
  private subject = new Subject<string>();
  subjectEmissions: string[] = [];
  subjectSubscriptions: string[] = [];
  private subjectSubs: Subscription[] = [];

  // --- BehaviorSubject Demo ---
  private behaviorSubject = new BehaviorSubject<string>('Initial');
  behaviorSubjectEmissions: string[] = [];
  behaviorSubjectSubscriptions: string[] = [];
  private behaviorSubjectSubs: Subscription[] = [];

  ngOnInit(): void {
    // No-op: subscriptions are triggered by user actions
  }

  // --- Subject Methods ---
  emitSubject(value: string) {
    this.subject.next(value);
    this.subjectEmissions.push(`Emitted: ${value}`);
  }

  subscribeToSubject() {
    const subIndex = this.subjectSubs.length + 1;
    this.subjectSubscriptions.push(`Subscriber #${subIndex} subscribed`);
    const sub = this.subject.subscribe(val => {
      this.subjectSubscriptions.push(`Subscriber #${subIndex} received: ${val}`);
    });
    this.subjectSubs.push(sub);
  }

  unsubscribeFromSubject() {
    if (this.subjectSubs.length > 0) {
      const sub = this.subjectSubs.pop();
      sub?.unsubscribe();
      this.subjectSubscriptions.push(`Subscriber #${this.subjectSubs.length + 1} unsubscribed`);
    }
  }

  // --- BehaviorSubject Methods ---
  emitBehaviorSubject(value: string) {
    this.behaviorSubject.next(value);
    this.behaviorSubjectEmissions.push(`Emitted: ${value}`);
  }

  subscribeToBehaviorSubject() {
    const subIndex = this.behaviorSubjectSubs.length + 1;
    this.behaviorSubjectSubscriptions.push(`Subscriber #${subIndex} subscribed`);
    const sub = this.behaviorSubject.subscribe(val => {
      this.behaviorSubjectSubscriptions.push(`Subscriber #${subIndex} received: ${val}`);
    });
    this.behaviorSubjectSubs.push(sub);
  }

  unsubscribeFromBehaviorSubject() {
    if (this.behaviorSubjectSubs.length > 0) {
      const sub = this.behaviorSubjectSubs.pop();
      sub?.unsubscribe();
      this.behaviorSubjectSubscriptions.push(`Subscriber #${this.behaviorSubjectSubs.length + 1} unsubscribed`);
    }
  }

  ngOnDestroy(): void {
    this.subjectSubs.forEach(sub => sub.unsubscribe());
    this.behaviorSubjectSubs.forEach(sub => sub.unsubscribe());
  }
} 