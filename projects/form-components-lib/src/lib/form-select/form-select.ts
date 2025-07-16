import { NgFor } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'fc-form-select',
  imports: [NgFor],
  templateUrl: './form-select.html',
  styleUrl: './form-select.scss'
})
export class FormSelectComponent {
  @Input() options: string[] = [];
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  onChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.valueChange.emit(value);
  }
}
