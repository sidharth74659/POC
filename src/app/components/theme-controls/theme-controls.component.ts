import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponent } from '../shared/slider/slider.component';
import { ButtonComponent } from '../shared/button/button.component';
import { ColorTokenViewerComponent } from '../color-token-viewer/color-token-viewer.component';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-controls',
  standalone: true,
  imports: [
    CommonModule,
    SliderComponent,
    ButtonComponent,
    ColorTokenViewerComponent
  ],
  templateUrl: './theme-controls.component.html',
  styleUrl: './theme-controls.component.scss'
})
export class ThemeControlsComponent {
  private themeService = inject(ThemeService);
  
  // Use computed values from the service
  btnContrast = this.themeService.btnContrast;
  hue = this.themeService.hue;
  hueShift = this.themeService.hueShift;
  mainChroma = this.themeService.mainChroma;
  accentChroma = this.themeService.accentChroma;
  isDarkTheme = this.themeService.isDarkTheme;
  
  // Update methods
  updateBtnContrast(value: number): void {
    this.themeService.updateTheme({ btnContrast: value });
  }
  
  updateHue(value: number): void {
    this.themeService.updateTheme({ hue: value });
  }
  
  updateHueShift(value: number): void {
    this.themeService.updateTheme({ hueShift: value });
  }
  
  updateMainChroma(value: number): void {
    this.themeService.updateTheme({ mainChroma: value });
  }
  
  updateAccentChroma(value: number): void {
    this.themeService.updateTheme({ accentChroma: value });
  }
  
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
  
  resetTheme(): void {
    this.themeService.resetTheme();
  }
}
