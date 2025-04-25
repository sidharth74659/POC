import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeControlsComponent } from './components/theme-controls/theme-controls.component';
import { PreviewPanelComponent } from './components/preview-panel/preview-panel.component';
import { DarkThemePreviewComponent } from './components/dark-theme-preview/dark-theme-preview.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ThemeControlsComponent,
    PreviewPanelComponent,
    DarkThemePreviewComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ui-debugger';
}
