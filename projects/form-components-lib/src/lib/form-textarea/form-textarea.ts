import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'fc-form-textarea',
  imports: [],
  templateUrl: './form-textarea.html',
  styleUrl: './form-textarea.scss'
})
export class FormTextareaComponent {
  @Input() value: string = '';
  @Input() placeholder: string = '';
  @Output() valueChange = new EventEmitter<string>();

  onInput(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    this.valueChange.emit(value);
  }
}
