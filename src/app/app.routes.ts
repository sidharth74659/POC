import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'llm-chat',
    loadComponent: () =>
      import('./pages/llm-chat/llm-chat.page').then((m) => m.LlmChatPage),
  },
];
