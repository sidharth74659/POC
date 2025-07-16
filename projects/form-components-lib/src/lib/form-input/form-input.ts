import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'fc-form-input',
  imports: [],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss'
})
export class FormInputComponent {
  @Input() value: string = '';
  @Input() placeholder: string = '';
  @Output() valueChange = new EventEmitter<string>();

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.valueChange.emit(value);
  }
}
