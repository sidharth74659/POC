import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../shared/button/button.component';
import { CardComponent } from '../shared/card/card.component';

@Component({
  selector: 'app-preview-panel',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    CardComponent
  ],
  templateUrl: './preview-panel.component.html',
  styleUrl: './preview-panel.component.scss'
})
export class PreviewPanelComponent {
  items = [
    { id: 1, text: 'Some first item', selected: false },
    { id: 2, text: 'Selected item', selected: true },
    { id: 3, text: 'I\'m just sitting here', selected: false },
    { id: 4, text: 'May the 4th be with you', selected: false }
  ];
}
