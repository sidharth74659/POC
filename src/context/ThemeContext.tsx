import React, { createContext, useContext, useEffect, useState } from 'react';
import { setTheme } from '@ui5/webcomponents-base/dist/config/Theme.js';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    // Check localStorage for saved preference
    const savedTheme = localStorage.getItem('ui5-design-system-theme') as ThemeType;
    if (savedTheme) return savedTheme;
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  useEffect(() => {
    // Apply theme to document root
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.className = theme;
    
    // Set UI5 theme
    setTheme(theme === 'dark' ? 'sap_horizon_dark' : 'sap_horizon');
    
    // Save to localStorage
    localStorage.setItem('ui5-design-system-theme', theme);
    
    // Apply CSS custom properties
    const root = document.documentElement;
    const themeColors = theme === 'dark' ? {
      '--bg-primary': '#0a0e1a',
      '--bg-secondary': '#0f172a',
      '--bg-tertiary': '#1e293b',
      '--text-primary': '#f8fafc',
      '--text-secondary': '#cbd5e1',
      '--text-tertiary': '#64748b',
      '--border-primary': '#1e293b',
      '--border-secondary': '#334155',
    } : {
      '--bg-primary': '#f8fafc',
      '--bg-secondary': '#f1f5f9',
      '--bg-tertiary': '#e2e8f0',
      '--text-primary': '#0f172a',
      '--text-secondary': '#334155',
      '--text-tertiary': '#64748b',
      '--border-primary': '#e2e8f0',
      '--border-secondary': '#cbd5e1',
    };
    
    Object.entries(themeColors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setThemeValue = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setThemeValue }}>
      {children}
    </ThemeContext.Provider>
  );
};