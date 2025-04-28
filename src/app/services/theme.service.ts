import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Theme } from '../models/theme.model';

export interface ThemeConfig {
  btnContrast: number;
  hue: number;
  hueShift: number;
  mainChroma: number;
  accentChroma: number;
  isDarkTheme: boolean;
  name?: string; // Optional name for saved themes
}

export interface ThemeAccessibility {
  contrastRatio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
  recommendation?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  
  private readonly THEMES_STORAGE_KEY = 'saved_themes';
  private readonly CURRENT_THEME_KEY = 'current_theme';
  
  private defaultTheme: Theme = {
    id: 'default',
    name: 'Default Theme',
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      backgroundColor: '#ffffff',
      textColor: '#212529',
      headingColor: '#343a40',
      errorColor: '#dc3545',
      successColor: '#28a745',
      borderColor: '#dee2e6'
    }
  };
  
  // Default theme configuration
  private readonly defaultConfig: ThemeConfig = {
    btnContrast: 7,
    hue: 327,
    hueShift: 80,
    mainChroma: 0.01,
    accentChroma: 0.3,
    isDarkTheme: false,
    name: 'Default'
  };

  // Reactive state with signals
  private _themeConfig = signal<ThemeConfig>({...this.defaultConfig});
  private _savedThemes = signal<ThemeConfig[]>([]);
  private _accessibilityInfo = signal<ThemeAccessibility>({
    contrastRatio: 4.5,
    wcagAA: true,
    wcagAAA: false
  });
  
  // Public readable signals
  public readonly btnContrast = computed(() => this._themeConfig().btnContrast);
  public readonly hue = computed(() => this._themeConfig().hue);
  public readonly hueShift = computed(() => this._themeConfig().hueShift);
  public readonly mainChroma = computed(() => this._themeConfig().mainChroma);
  public readonly accentChroma = computed(() => this._themeConfig().accentChroma);
  public readonly isDarkTheme = computed(() => this._themeConfig().isDarkTheme);
  public readonly themeName = computed(() => this._themeConfig().name || 'Unnamed Theme');
  public readonly savedThemes = computed(() => this._savedThemes());
  public readonly accessibility = computed(() => this._accessibilityInfo());
  
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromLocalStorage();
      this.loadSavedThemes();
      this.applyTheme();
      
      // Listen for storage events from other tabs
      window.addEventListener('storage', (event) => {
        if (event.key === 'uiDebuggerTheme') {
          this.loadFromLocalStorage();
          this.applyTheme();
        } else if (event.key === 'uiDebuggerSavedThemes') {
          this.loadSavedThemes();
        }
      });
    }
  }
  
  private loadFromLocalStorage(): void {
    const savedTheme = localStorage.getItem('uiDebuggerTheme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme) as ThemeConfig;
        this._themeConfig.set(parsedTheme);
      } catch (error) {
        console.error('Failed to parse saved theme:', error);
      }
    }
  }
  
  private saveToLocalStorage(): void {
    localStorage.setItem('uiDebuggerTheme', JSON.stringify(this._themeConfig()));
  }
  
  private loadSavedThemes(): void {
    const savedThemesJson = localStorage.getItem('uiDebuggerSavedThemes');
    if (savedThemesJson) {
      try {
        const themes = JSON.parse(savedThemesJson) as ThemeConfig[];
        this._savedThemes.set(themes);
      } catch (error) {
        console.error('Failed to parse saved themes:', error);
      }
    }
  }
  
  private saveSavedThemes(): void {
    localStorage.setItem('uiDebuggerSavedThemes', JSON.stringify(this._savedThemes()));
  }
  
  public updateTheme(updates: Partial<ThemeConfig>): void {
    // Update theme with new values
    this._themeConfig.update(current => ({
      ...current,
      ...updates
    }));
    
    // Apply the updated theme
    this.applyTheme();
    
    // Save to localStorage
    this.saveToLocalStorage();
    
    // Update accessibility info
    this.calculateAccessibility();
  }
  
  public toggleTheme(): void {
    this.updateTheme({
      isDarkTheme: !this._themeConfig().isDarkTheme
    });
  }
  
  public resetTheme(): void {
    this._themeConfig.set({...this.defaultConfig});
    this.applyTheme();
    this.saveToLocalStorage();
    this.calculateAccessibility();
  }
  
  public saveCurrentTheme(name: string): void {
    const currentTheme = {...this._themeConfig()};
    currentTheme.name = name;
    
    this._savedThemes.update(themes => {
      // Remove any existing theme with the same name
      const filteredThemes = themes.filter(t => t.name !== name);
      return [...filteredThemes, currentTheme];
    });
    
    this.saveSavedThemes();
  }
  
  public loadTheme(name: string): void {
    const theme = this._savedThemes().find(t => t.name === name);
    if (theme) {
      this._themeConfig.set({...theme});
      this.applyTheme();
      this.saveToLocalStorage();
      this.calculateAccessibility();
    }
  }
  
  public deleteTheme(name: string): void {
    this._savedThemes.update(themes => themes.filter(t => t.name !== name));
    this.saveSavedThemes();
    
    // If we're deleting the current theme, revert to default
    const currentTheme = this.getCurrentTheme();
    if (currentTheme.id === name) {
      this.applyThemeToDOM(this.defaultTheme);
    }
  }
  
  public exportTheme(): string {
    return JSON.stringify(this._themeConfig());
  }
  
  public exportThemeAsCSS(): string {
    const theme = this._themeConfig();
    const prefix = theme.isDarkTheme ? '--d-c-acc-' : '--c-acc-';
    let css = `:root {\n`;
    
    // Add the theme configuration variables
    css += `  --btn-contrast: ${theme.btnContrast};\n`;
    css += `  --hue: ${theme.hue};\n`;
    css += `  --hue-shift: ${theme.hueShift};\n`;
    css += `  --main-chroma: ${theme.mainChroma};\n`;
    css += `  --accent-chroma: ${theme.accentChroma};\n\n`;
    
    // Add the computed color variables
    const accentHue = theme.hue;
    const primaryHue = (theme.hue + theme.hueShift) % 360;
    const buttonLightness = Math.max(30, Math.min(70, 50 - theme.btnContrast * 2));
    
    css += `  /* Generated color tokens */\n`;
    
    if (theme.isDarkTheme) {
      css += `  --d-c-acc-base: hsl(${accentHue}, 100%, 50%);\n`;
      css += `  --d-c-acc-app-bg: hsl(${accentHue}, 30%, 15%);\n`;
      css += `  --d-c-acc-surface-normal: hsl(${accentHue}, 20%, 18%);\n`;
      css += `  --d-c-acc-surface-hover: hsl(${accentHue}, 20%, 22%);\n`;
      css += `  --d-c-acc-surface-active: hsl(${accentHue}, 20%, 25%);\n`;
      css += `  --d-c-acc-divider: hsl(${accentHue}, 20%, 30%);\n`;
      css += `  --d-c-acc-text-secondary: hsl(${accentHue}, 80%, 70%);\n`;
      css += `  --d-c-acc-text-primary: hsl(0, 0%, 100%);\n`;
      css += `  --d-c-acc-btn-normal: hsl(${accentHue}, 70%, ${buttonLightness}%);\n`;
      css += `  --d-c-acc-btn-hover: hsl(${accentHue}, 70%, ${buttonLightness - 5}%);\n`;
      css += `  --d-c-acc-btn-active: hsl(${accentHue}, 70%, ${buttonLightness - 10}%);\n`;
      css += `  --d-c-acc-btn-text: hsl(0, 0%, 100%);\n`;
    } else {
      css += `  --c-acc-base: hsl(${accentHue}, 100%, 50%);\n`;
      css += `  --c-acc-app-bg: hsl(${primaryHue}, ${theme.mainChroma * 100}%, 97%);\n`;
      css += `  --c-acc-surface-normal: hsl(${primaryHue}, ${theme.mainChroma * 100}%, 97%);\n`;
      css += `  --c-acc-surface-hover: hsl(${accentHue}, ${theme.accentChroma * 100}%, 95%);\n`;
      css += `  --c-acc-surface-active: hsl(${accentHue}, ${theme.accentChroma * 100}%, 92%);\n`;
      css += `  --c-acc-divider: hsl(${accentHue}, ${theme.accentChroma * 100}%, 90%);\n`;
      css += `  --c-acc-text-secondary: hsl(${accentHue}, 80%, 50%);\n`;
      css += `  --c-acc-text-primary: hsl(${accentHue}, 100%, 10%);\n`;
      css += `  --c-acc-btn-normal: hsl(${accentHue}, 80%, ${buttonLightness}%);\n`;
      css += `  --c-acc-btn-hover: hsl(${accentHue}, 80%, ${buttonLightness - 5}%);\n`;
      css += `  --c-acc-btn-active: hsl(${accentHue}, 80%, ${buttonLightness - 10}%);\n`;
      css += `  --c-acc-btn-text: hsl(0, 0%, 100%);\n`;
    }
    
    css += `}\n`;
    
    return css;
  }
  
  public importTheme(themeJson: string): boolean {
    try {
      const theme = JSON.parse(themeJson) as ThemeConfig;
      
      // Validate theme has required properties
      if (
        typeof theme.btnContrast !== 'number' ||
        typeof theme.hue !== 'number' ||
        typeof theme.hueShift !== 'number' ||
        typeof theme.mainChroma !== 'number' ||
        typeof theme.accentChroma !== 'number'
      ) {
        return false;
      }
      
      this._themeConfig.set(theme);
      this.applyTheme();
      this.saveToLocalStorage();
      this.calculateAccessibility();
      return true;
    } catch (error) {
      console.error('Failed to import theme:', error);
      return false;
    }
  }
  
  private applyTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const { btnContrast, hue, hueShift, mainChroma, accentChroma, isDarkTheme } = this._themeConfig();
    
    // Set CSS variables
    document.documentElement.style.setProperty('--btn-contrast', btnContrast.toString());
    document.documentElement.style.setProperty('--hue', hue.toString());
    document.documentElement.style.setProperty('--hue-shift', hueShift.toString());
    document.documentElement.style.setProperty('--main-chroma', mainChroma.toString());
    document.documentElement.style.setProperty('--accent-chroma', accentChroma.toString());
    
    // Apply dark theme class to body
    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
      // Also add data attribute for CSS selectors
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Update dynamic colors based on the current configuration
    this.updateDynamicColors();
    
    // Create a custom event for other components to listen to
    const themeChangeEvent = new CustomEvent('themechange', { 
      detail: { isDarkTheme, theme: this._themeConfig() }
    });
    document.dispatchEvent(themeChangeEvent);
  }
  
  private updateDynamicColors(): void {
    const { hue, hueShift, mainChroma, accentChroma, btnContrast } = this._themeConfig();
    
    // Calculate the accent color
    const accentHue = hue;
    const primaryHue = (hue + hueShift) % 360;
    
    // Apply button contrast
    const buttonLightness = Math.max(30, Math.min(70, 50 - btnContrast * 2));
    
    // Set light theme colors
    document.documentElement.style.setProperty('--c-acc-base', `hsl(${accentHue}, 100%, 50%)`);
    document.documentElement.style.setProperty('--c-acc-app-bg', `hsl(${primaryHue}, ${mainChroma * 100}%, 97%)`);
    document.documentElement.style.setProperty('--c-acc-surface-normal', `hsl(${primaryHue}, ${mainChroma * 100}%, 97%)`);
    document.documentElement.style.setProperty('--c-acc-surface-hover', `hsl(${accentHue}, ${accentChroma * 100}%, 95%)`);
    document.documentElement.style.setProperty('--c-acc-surface-active', `hsl(${accentHue}, ${accentChroma * 100}%, 92%)`);
    document.documentElement.style.setProperty('--c-acc-divider', `hsl(${accentHue}, ${accentChroma * 100}%, 90%)`);
    document.documentElement.style.setProperty('--c-acc-text-secondary', `hsl(${accentHue}, 80%, 50%)`);
    document.documentElement.style.setProperty('--c-acc-text-primary', `hsl(${accentHue}, 100%, 10%)`);
    document.documentElement.style.setProperty('--c-acc-btn-normal', `hsl(${accentHue}, 80%, ${buttonLightness}%)`);
    document.documentElement.style.setProperty('--c-acc-btn-hover', `hsl(${accentHue}, 80%, ${buttonLightness - 5}%)`);
    document.documentElement.style.setProperty('--c-acc-btn-active', `hsl(${accentHue}, 80%, ${buttonLightness - 10}%)`);
    
    // Set dark theme colors
    document.documentElement.style.setProperty('--d-c-acc-base', `hsl(${accentHue}, 100%, 50%)`);
    document.documentElement.style.setProperty('--d-c-acc-app-bg', `hsl(${accentHue}, 30%, 15%)`);
    document.documentElement.style.setProperty('--d-c-acc-surface-normal', `hsl(${accentHue}, 20%, 18%)`);
    document.documentElement.style.setProperty('--d-c-acc-surface-hover', `hsl(${accentHue}, 20%, 22%)`);
    document.documentElement.style.setProperty('--d-c-acc-surface-active', `hsl(${accentHue}, 20%, 25%)`);
    document.documentElement.style.setProperty('--d-c-acc-divider', `hsl(${accentHue}, 20%, 30%)`);
    document.documentElement.style.setProperty('--d-c-acc-text-secondary', `hsl(${accentHue}, 80%, 70%)`);
    document.documentElement.style.setProperty('--d-c-acc-btn-normal', `hsl(${accentHue}, 70%, ${buttonLightness}%)`);
    document.documentElement.style.setProperty('--d-c-acc-btn-hover', `hsl(${accentHue}, 70%, ${buttonLightness - 5}%)`);
    document.documentElement.style.setProperty('--d-c-acc-btn-active', `hsl(${accentHue}, 70%, ${buttonLightness - 10}%)`);
  }

  private calculateAccessibility(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const isDark = this._themeConfig().isDarkTheme;
    
    // Get the text and background colors
    let textColor: string;
    let backgroundColor: string;
    
    if (isDark) {
      textColor = getComputedStyle(document.documentElement).getPropertyValue('--d-c-acc-text-primary').trim();
      backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--d-c-acc-surface-normal').trim();
    } else {
      textColor = getComputedStyle(document.documentElement).getPropertyValue('--c-acc-text-primary').trim();
      backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--c-acc-surface-normal').trim();
    }

    // Convert colors to RGB for contrast calculation
    const textRgb = this.colorToRgb(textColor);
    const bgRgb = this.colorToRgb(backgroundColor);

    if (!textRgb || !bgRgb) {
      return;
    }

    // Calculate contrast ratio using WCAG formula
    const contrastRatio = this.calculateContrastRatio(textRgb, bgRgb);
    
    // WCAG 2.1 standards
    const wcagAA = contrastRatio >= 4.5;
    const wcagAAA = contrastRatio >= 7.0;
    
    // Create recommendations based on results
    let recommendation = '';
    if (!wcagAA) {
      recommendation = 'Increase contrast - current level doesn\'t meet WCAG AA standards (4.5:1)';
    } else if (!wcagAAA) {
      recommendation = 'Consider increasing contrast for WCAG AAA compliance (7:1)';
    } else {
      recommendation = 'Excellent contrast ratio that meets WCAG AAA standards!';
    }
    
    this._accessibilityInfo.set({
      contrastRatio: parseFloat(contrastRatio.toFixed(2)),
      wcagAA,
      wcagAAA,
      recommendation
    });
  }
  
  private colorToRgb(color: string): { r: number, g: number, b: number } | null {
    // Create a hidden element to compute the color
    const el = document.createElement('div');
    el.style.color = color;
    el.style.display = 'none';
    document.body.appendChild(el);
    
    // Get computed color
    const computedColor = getComputedStyle(el).color;
    document.body.removeChild(el);
    
    // Parse RGB values
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
  
  private calculateContrastRatio(foreground: { r: number, g: number, b: number }, background: { r: number, g: number, b: number }): number {
    // Calculate luminance for both colors
    const luminance1 = this.calculateLuminance(foreground);
    const luminance2 = this.calculateLuminance(background);
    
    // Calculate contrast ratio
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }
  
  private calculateLuminance(rgb: { r: number, g: number, b: number }): number {
    // Convert RGB to sRGB values
    const sRgb = {
      r: rgb.r / 255,
      g: rgb.g / 255,
      b: rgb.b / 255
    };
    
    // Apply gamma correction
    const gammaCorrect = {
      r: sRgb.r <= 0.03928 ? sRgb.r / 12.92 : Math.pow((sRgb.r + 0.055) / 1.055, 2.4),
      g: sRgb.g <= 0.03928 ? sRgb.g / 12.92 : Math.pow((sRgb.g + 0.055) / 1.055, 2.4),
      b: sRgb.b <= 0.03928 ? sRgb.b / 12.92 : Math.pow((sRgb.b + 0.055) / 1.055, 2.4)
    };
    
    // Calculate luminance using WCAG formula
    return 0.2126 * gammaCorrect.r + 0.7152 * gammaCorrect.g + 0.0722 * gammaCorrect.b;
  }

  getCurrentTheme(): Theme {
    const storedTheme = localStorage.getItem(this.CURRENT_THEME_KEY);
    return storedTheme ? JSON.parse(storedTheme) : this.defaultTheme;
  }

  getSavedThemes(): Theme[] {
    const storedThemes = localStorage.getItem(this.THEMES_STORAGE_KEY);
    return storedThemes ? JSON.parse(storedThemes) : [this.defaultTheme];
  }

  saveTheme(theme: Theme): void {
    const themes = this.getSavedThemes();
    const existingIndex = themes.findIndex(t => t.id === theme.id);
    
    if (existingIndex >= 0) {
      themes[existingIndex] = theme;
    } else {
      themes.push(theme);
    }
    
    localStorage.setItem(this.THEMES_STORAGE_KEY, JSON.stringify(themes));
  }

  // Helper method to apply legacy themes
  applyThemeToDOM(theme: Theme): void {
    const css = this.themeToCss(theme);
    let style = document.getElementById('theme-style');
    
    if (!style) {
      style = document.createElement('style');
      style.id = 'theme-style';
      document.head.appendChild(style);
    }
    
    style.textContent = css;
  }

  // Convert a theme to CSS
  themeToCss(theme: Theme): string {
    return `:root {
      --primary-color: ${theme.colors.primary};
      --secondary-color: ${theme.colors.secondary};
      --background-color: ${theme.colors.backgroundColor};
      --text-color: ${theme.colors.textColor};
      --heading-color: ${theme.colors.headingColor};
      --error-color: ${theme.colors.errorColor};
      --success-color: ${theme.colors.successColor};
      --border-color: ${theme.colors.borderColor};
    }`;
  }

  // Helper method for theme management component
  importThemes(themes: Theme[]): number {
    let importedCount = 0;
    
    for (const theme of themes) {
      if (theme && theme.id && theme.name && theme.colors) {
        // Generate a new ID to avoid conflicts
        theme.id = 'imported_' + new Date().getTime() + '_' + importedCount;
        this.saveTheme(theme);
        importedCount++;
      }
    }
    
    return importedCount;
  }
}
