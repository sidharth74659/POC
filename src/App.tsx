import React from 'react';
import { ThemeProvider } from '@ui5/webcomponents-react';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import { ToastContainer } from './components/Toast/Toast';
import { ComponentShowcase } from './showcase/ComponentShowcase';
import './App.css';

function App() {
  return (
    <CustomThemeProvider>
      <ThemeProvider>
        <div className="app">
          <ComponentShowcase />
          <ToastContainer />
        </div>
      </ThemeProvider>
    </CustomThemeProvider>
  );
}

export default App;