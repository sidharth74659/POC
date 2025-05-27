import React, { createContext, useContext, useEffect, useState } from 'react';
import type { IThemeContextValue, ThemeMode } from '../interfaces';
import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';

const ThemeContext = createContext<IThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'doctrack-theme',
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(storageKey) as ThemeMode) || defaultTheme;
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark');

    if (mode === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(mode);
    }
  }, [mode]);

  const value: IThemeContextValue = {
    theme: mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ? darkTheme
      : lightTheme,
    mode,
    setMode: (theme: ThemeMode) => {
      localStorage.setItem(storageKey, theme);
      setMode(theme);
    },
    toggleTheme: () => {
      const newMode = mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light';
      localStorage.setItem(storageKey, newMode);
      setMode(newMode);
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}; 