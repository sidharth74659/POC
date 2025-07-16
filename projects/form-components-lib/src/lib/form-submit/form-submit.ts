import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'fc-form-submit',
  imports: [],
  templateUrl: './form-submit.html',
  styleUrl: './form-submit.scss'
})
export class FormSubmitComponent {
  @Input() label: string = 'Submit';
  @Output() submitClick = new EventEmitter<void>();

  onClick(event: Event) {
    event.preventDefault();
    this.submitClick.emit();
  }
}
