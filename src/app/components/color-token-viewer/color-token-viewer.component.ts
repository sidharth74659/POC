import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

interface ColorToken {
  name: string;
  value: string;
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
        value
      });
    }
    
    this.colorTokens.set(tokens);
  }
}
