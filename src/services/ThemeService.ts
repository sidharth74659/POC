import type { ThemeMode } from '../interfaces';

/**
 * Service for managing theme preferences and operations
 * Handles theme persistence, system detection, and theme switching
 */
export class ThemeService {
  private readonly storageKey: string;
  private readonly mediaQuery: MediaQueryList;

  constructor(storageKey = 'doctrack-theme') {
    this.storageKey = storageKey;
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  }

  /**
   * Get the current theme from localStorage
   */
  getStoredTheme(): ThemeMode | null {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        return stored as ThemeMode;
      }
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error);
    }
    return null;
  }

  /**
   * Store theme preference in localStorage
   */
  setStoredTheme(theme: ThemeMode): void {
    try {
      localStorage.setItem(this.storageKey, theme);
    } catch (error) {
      console.warn('Failed to store theme in localStorage:', error);
    }
  }

  /**
   * Get the system's preferred color scheme
   */
  getSystemTheme(): 'light' | 'dark' {
    return this.mediaQuery.matches ? 'dark' : 'light';
  }

  /**
   * Resolve the effective theme based on preference and system settings
   */
  resolveTheme(themeMode: ThemeMode): 'light' | 'dark' {
    if (themeMode === 'system') {
      return this.getSystemTheme();
    }
    return themeMode;
  }

  /**
   * Apply theme to the document
   */
  applyTheme(theme: 'light' | 'dark'): void {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add new theme class
    root.classList.add(theme);
    
    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(theme);
  }

  /**
   * Update meta theme-color for mobile browsers
   */
  private updateMetaThemeColor(theme: 'light' | 'dark'): void {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const color = theme === 'dark' ? '#0a0a0a' : '#ffffff';
    
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', color);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = color;
      document.head.appendChild(meta);
    }
  }

  /**
   * Listen for system theme changes
   */
  onSystemThemeChange(callback: (isDark: boolean) => void): () => void {
    const handler = (e: MediaQueryListEvent) => {
      callback(e.matches);
    };

    this.mediaQuery.addEventListener('change', handler);
    
    // Return cleanup function
    return () => {
      this.mediaQuery.removeEventListener('change', handler);
    };
  }

  /**
   * Get theme-aware CSS custom properties
   */
  getThemeProperties(theme: 'light' | 'dark'): Record<string, string> {
    const lightProperties = {
      '--background': '0 0% 100%',
      '--foreground': '222.2 84% 4.9%',
      '--card': '0 0% 100%',
      '--card-foreground': '222.2 84% 4.9%',
      '--popover': '0 0% 100%',
      '--popover-foreground': '222.2 84% 4.9%',
      '--primary': '221.2 83.2% 53.3%',
      '--primary-foreground': '210 40% 98%',
      '--secondary': '210 40% 96%',
      '--secondary-foreground': '222.2 84% 4.9%',
      '--muted': '210 40% 96%',
      '--muted-foreground': '215.4 16.3% 46.9%',
      '--accent': '210 40% 96%',
      '--accent-foreground': '222.2 84% 4.9%',
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '210 40% 98%',
      '--border': '214.3 31.8% 91.4%',
      '--input': '214.3 31.8% 91.4%',
      '--ring': '221.2 83.2% 53.3%',
      '--radius': '0.5rem'
    };

    const darkProperties = {
      '--background': '222.2 84% 4.9%',
      '--foreground': '210 40% 98%',
      '--card': '222.2 84% 4.9%',
      '--card-foreground': '210 40% 98%',
      '--popover': '222.2 84% 4.9%',
      '--popover-foreground': '210 40% 98%',
      '--primary': '217.2 91.2% 59.8%',
      '--primary-foreground': '222.2 84% 4.9%',
      '--secondary': '217.2 32.6% 17.5%',
      '--secondary-foreground': '210 40% 98%',
      '--muted': '217.2 32.6% 17.5%',
      '--muted-foreground': '215 20.2% 65.1%',
      '--accent': '217.2 32.6% 17.5%',
      '--accent-foreground': '210 40% 98%',
      '--destructive': '0 62.8% 30.6%',
      '--destructive-foreground': '210 40% 98%',
      '--border': '217.2 32.6% 17.5%',
      '--input': '217.2 32.6% 17.5%',
      '--ring': '224.3 76.3% 94.1%',
      '--radius': '0.5rem'
    };

    return theme === 'dark' ? darkProperties : lightProperties;
  }

  /**
   * Apply CSS custom properties to the document
   */
  applyThemeProperties(theme: 'light' | 'dark'): void {
    const properties = this.getThemeProperties(theme);
    const root = document.documentElement;

    Object.entries(properties).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }

  /**
   * Initialize theme on app startup
   */
  initializeTheme(defaultTheme: ThemeMode = 'system'): ThemeMode {
    const storedTheme = this.getStoredTheme() || defaultTheme;
    const resolvedTheme = this.resolveTheme(storedTheme);
    
    this.applyTheme(resolvedTheme);
    this.applyThemeProperties(resolvedTheme);
    
    return storedTheme;
  }

  /**
   * Switch to a new theme
   */
  switchTheme(newTheme: ThemeMode): void {
    this.setStoredTheme(newTheme);
    const resolvedTheme = this.resolveTheme(newTheme);
    this.applyTheme(resolvedTheme);
    this.applyThemeProperties(resolvedTheme);
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme(currentTheme: ThemeMode): ThemeMode {
    if (currentTheme === 'system') {
      const systemTheme = this.getSystemTheme();
      const newTheme = systemTheme === 'dark' ? 'light' : 'dark';
      this.switchTheme(newTheme);
      return newTheme;
    } else {
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      this.switchTheme(newTheme);
      return newTheme;
    }
  }

  /**
   * Check if the current theme is dark
   */
  isDarkTheme(themeMode: ThemeMode): boolean {
    return this.resolveTheme(themeMode) === 'dark';
  }

  /**
   * Get theme-specific icon name
   */
  getThemeIcon(themeMode: ThemeMode): 'sun' | 'moon' | 'monitor' {
    switch (themeMode) {
      case 'light':
        return 'sun';
      case 'dark':
        return 'moon';
      case 'system':
        return 'monitor';
      default:
        return 'monitor';
    }
  }
}

export const themeService = new ThemeService(); 