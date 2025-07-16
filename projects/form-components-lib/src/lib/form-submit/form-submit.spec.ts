import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSubmit } from './form-submit';

describe('FormSubmit', () => {
  let component: FormSubmit;
  let fixture: ComponentFixture<FormSubmit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSubmit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormSubmit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
