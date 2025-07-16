import { CommonModule, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { DynamicFormComponent } from 'form-components-lib';
import { IFormFieldConfig, IFormOutputData } from 'form-components-lib';

@Component({
  selector: 'app-root',
  imports: [DynamicFormComponent, JsonPipe, CommonModule],
  template: `
    <main>
      <h1>{{ formTitle }}</h1>
      <p>{{ formDescription }}</p>
      <fc-dynamic-form [config]="formConfig" (formSubmit)="onFormSubmit($event)"></fc-dynamic-form>
      <div *ngIf="showToast" class="toast">Form submitted!</div>
      <pre *ngIf="submittedData" class="submitted-data">{{ submittedData | json }}</pre>
    </main>
  `,
  styleUrl: './app.scss'
})
export class App {
  formTitle = 'User Registration';
  formDescription = 'Please fill in the details to register.';

  formConfig: IFormFieldConfig[] = [
    { type: 'input', label: 'Username', name: 'username' },
    { type: 'input', label: 'Email', name: 'email' },
    { type: 'select', label: 'User Role', name: 'role', options: ['Admin', 'User', 'Guest'] }
  ];

  showToast = false;
  submittedData: IFormOutputData | null = null;

  onFormSubmit(data: IFormOutputData) {
    this.submittedData = data;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 2000);
  }
}
