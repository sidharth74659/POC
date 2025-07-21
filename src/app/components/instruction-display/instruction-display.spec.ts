import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionDisplay } from './instruction-display';

describe('InstructionDisplay', () => {
  let component: InstructionDisplay;
  let fixture: ComponentFixture<InstructionDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructionDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructionDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
