import { Injectable, signal, computed } from '@angular/core';

export interface ThemeConfig {
  btnContrast: number;
  hue: number;
  hueShift: number;
  mainChroma: number;
  accentChroma: number;
  isDarkTheme: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Default theme configuration
  private readonly defaultConfig: ThemeConfig = {
    btnContrast: 7,
    hue: 327,
    hueShift: 80,
    mainChroma: 0.01,
    accentChroma: 0.3,
    isDarkTheme: false
  };

  // Reactive state with signals
  private _themeConfig = signal<ThemeConfig>({...this.defaultConfig});
  
  // Public readable signals
  public readonly btnContrast = computed(() => this._themeConfig().btnContrast);
  public readonly hue = computed(() => this._themeConfig().hue);
  public readonly hueShift = computed(() => this._themeConfig().hueShift);
  public readonly mainChroma = computed(() => this._themeConfig().mainChroma);
  public readonly accentChroma = computed(() => this._themeConfig().accentChroma);
  public readonly isDarkTheme = computed(() => this._themeConfig().isDarkTheme);
  
  constructor() {
    this.loadFromLocalStorage();
    this.applyTheme();
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
  }
  
  private applyTheme(): void {
    const { btnContrast, hue, hueShift, mainChroma, accentChroma, isDarkTheme } = this._themeConfig();
    
    // Set CSS variables
    document.documentElement.style.setProperty('--btn-contrast', btnContrast.toString());
    document.documentElement.style.setProperty('--hue', hue.toString());
    document.documentElement.style.setProperty('--hue-shift', hueShift.toString());
    document.documentElement.style.setProperty('--main-chroma', mainChroma.toString());
    document.documentElement.style.setProperty('--accent-chroma', accentChroma.toString());
    
    // Apply dark theme class
    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    
    // Update dynamic colors based on the current configuration
    this.updateDynamicColors();
  }
  
  private updateDynamicColors(): void {
    const { hue, hueShift, mainChroma, accentChroma } = this._themeConfig();
    
    // Calculate the accent color
    const accentHue = hue;
    const primaryHue = (hue + hueShift) % 360;
    
    // Set light theme colors
    document.documentElement.style.setProperty('--c-acc-base', `hsl(${accentHue}, 100%, 50%)`);
    document.documentElement.style.setProperty('--c-acc-app-bg', `hsl(${primaryHue}, ${mainChroma * 100}%, 97%)`);
    document.documentElement.style.setProperty('--c-acc-surface-normal', `hsl(${primaryHue}, ${mainChroma * 100}%, 97%)`);
    document.documentElement.style.setProperty('--c-acc-surface-hover', `hsl(${accentHue}, ${accentChroma * 100}%, 95%)`);
    document.documentElement.style.setProperty('--c-acc-surface-active', `hsl(${accentHue}, ${accentChroma * 100}%, 92%)`);
    document.documentElement.style.setProperty('--c-acc-divider', `hsl(${accentHue}, ${accentChroma * 100}%, 90%)`);
    document.documentElement.style.setProperty('--c-acc-text-secondary', `hsl(${accentHue}, 80%, 50%)`);
    document.documentElement.style.setProperty('--c-acc-text-primary', `hsl(${accentHue}, 100%, 10%)`);
    document.documentElement.style.setProperty('--c-acc-btn-normal', `hsl(${accentHue}, 80%, 50%)`);
    document.documentElement.style.setProperty('--c-acc-btn-hover', `hsl(${accentHue}, 80%, 45%)`);
    document.documentElement.style.setProperty('--c-acc-btn-active', `hsl(${accentHue}, 80%, 40%)`);
    
    // Set dark theme colors
    document.documentElement.style.setProperty('--d-c-acc-base', `hsl(${accentHue}, 100%, 50%)`);
    document.documentElement.style.setProperty('--d-c-acc-app-bg', `hsl(${accentHue}, 30%, 15%)`);
    document.documentElement.style.setProperty('--d-c-acc-surface-normal', `hsl(${accentHue}, 20%, 18%)`);
    document.documentElement.style.setProperty('--d-c-acc-surface-hover', `hsl(${accentHue}, 20%, 22%)`);
    document.documentElement.style.setProperty('--d-c-acc-surface-active', `hsl(${accentHue}, 20%, 25%)`);
    document.documentElement.style.setProperty('--d-c-acc-divider', `hsl(${accentHue}, 20%, 30%)`);
    document.documentElement.style.setProperty('--d-c-acc-text-secondary', `hsl(${accentHue}, 80%, 70%)`);
    document.documentElement.style.setProperty('--d-c-acc-btn-normal', `hsl(${accentHue}, 70%, 50%)`);
    document.documentElement.style.setProperty('--d-c-acc-btn-hover', `hsl(${accentHue}, 70%, 45%)`);
    document.documentElement.style.setProperty('--d-c-acc-btn-active', `hsl(${accentHue}, 70%, 40%)`);
  }
}
