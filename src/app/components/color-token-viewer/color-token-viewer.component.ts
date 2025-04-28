import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

interface ColorToken {
  name: string;
  value: string;
  textColor: string;
}

@Component({
  selector: 'app-color-token-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './color-token-viewer.component.html',
  styleUrl: './color-token-viewer.component.scss'
})
export class ColorTokenViewerComponent {
  private themeService = inject(ThemeService);
  
  isDarkTheme = this.themeService.isDarkTheme;
  colorTokens = signal<ColorToken[]>([]);
  
  ngOnInit(): void {
    this.updateColorTokens();
    
    // Update color tokens whenever the theme changes
    setInterval(() => {
      this.updateColorTokens();
    }, 1000);
  }
  
  private updateColorTokens(): void {
    const isDark = this.isDarkTheme();
    const prefix = isDark ? '--d-c-acc-' : '--c-acc-';
    const tokens: ColorToken[] = [];
    
    const properties = [
      'base',
      'app-bg',
      'surface-normal',
      'surface-hover',
      'surface-active',
      'divider',
      'text-secondary',
      'text-primary',
      'btn-normal',
      'btn-hover',
      'btn-active',
      'btn-text'
    ];
    
    for (const property of properties) {
      const name = `${prefix}${property}`;
      const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      
      tokens.push({
        name,
        value,
        textColor: this.getContrastColor(value)
      });
    }
    
    this.colorTokens.set(tokens);
  }
  
  /**
   * Gets a contrasting text color (black or white) based on background color brightness
   */
  private getContrastColor(backgroundColor: string): string {
    // Default to white if can't determine
    if (!backgroundColor) return '#ffffff';
    
    // Get RGB values using ThemeService's colorToRgb method
    const colorObj = this.colorToRgbObj(backgroundColor);
    if (!colorObj) return '#ffffff';
    
    // Calculate relative luminance using the formula: 0.299r + 0.587g + 0.114b
    const luminance = (0.299 * colorObj.r + 0.587 * colorObj.g + 0.114 * colorObj.b) / 255;
    
    // Use white text for dark backgrounds, black text for light backgrounds
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }
  
  /**
   * Helper method to convert color string to RGB object
   */
  private colorToRgbObj(color: string): { r: number, g: number, b: number } | null {
    // Create a temporary element to compute the RGB
    const tempEl = document.createElement('div');
    tempEl.style.color = color;
    tempEl.style.display = 'none';
    document.body.appendChild(tempEl);
    
    // Get computed RGB values
    const computedColor = getComputedStyle(tempEl).color;
    document.body.removeChild(tempEl);
    
    // Parse the computed RGB values
    const rgbMatch = computedColor.match(/\d+/g);
    if (rgbMatch && rgbMatch.length >= 3) {
      return {
        r: parseInt(rgbMatch[0]),
        g: parseInt(rgbMatch[1]),
        b: parseInt(rgbMatch[2])
      };
    }
    
    return null;
  }
}
