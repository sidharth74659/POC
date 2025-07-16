import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormComponentsLib } from './form-components-lib';

describe('FormComponentsLib', () => {
  let component: FormComponentsLib;
  let fixture: ComponentFixture<FormComponentsLib>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormComponentsLib]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormComponentsLib);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
