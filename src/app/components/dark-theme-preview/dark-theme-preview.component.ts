import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../shared/button/button.component';
import { CardComponent } from '../shared/card/card.component';

@Component({
  selector: 'app-dark-theme-preview',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    CardComponent
  ],
  templateUrl: './dark-theme-preview.component.html',
  styleUrl: './dark-theme-preview.component.scss'
})
export class DarkThemePreviewComponent {
  items = [
    { id: 1, text: 'Some first item', selected: false },
    { id: 2, text: 'Selected item', selected: true },
    { id: 3, text: 'I\'m just sitting here', selected: false },
    { id: 4, text: 'May the 4th be with you', selected: false }
  ];
}
