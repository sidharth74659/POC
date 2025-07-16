import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormInputComponent } from '../form-input/form-input';
import { FormTextareaComponent } from '../form-textarea/form-textarea';
import { FormSelectComponent } from '../form-select/form-select';
import { FormSubmitComponent } from '../form-submit/form-submit';
import { IFormFieldConfig, IFormOutputData } from '../interfaces/form-interfaces.interface';

@Component({
  selector: 'fc-dynamic-form',
  imports: [
    CommonModule,
    FormInputComponent,
    FormTextareaComponent,
    FormSelectComponent,
    FormSubmitComponent
  ],
  templateUrl: './dynamic-form.html',
  styleUrl: './dynamic-form.scss'
})
export class DynamicFormComponent {
  @Input() config: IFormFieldConfig[] = [];
  @Input() submitLabel: string = 'Submit';
  @Output() formSubmit = new EventEmitter<IFormOutputData>();

  formData: IFormOutputData = {};

  onInputChange(name: string, value: any) {
    this.formData[name] = value;
  }

  onSubmitClick() {
    this.formSubmit.emit(this.formData);
  }
}
