import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LlmChatPage } from './llm-chat.page';

describe('LlmChatPage', () => {
  let component: LlmChatPage;
  let fixture: ComponentFixture<LlmChatPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LlmChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
