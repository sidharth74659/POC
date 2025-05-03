/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
    './src/app/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3f51b5',
          light: '#757de8',
          dark: '#002984',
          foreground: '#ffffff'
        },
        secondary: {
          DEFAULT: '#f50057',
          light: '#ff5983',
          dark: '#bb002f',
          foreground: '#ffffff'
        },
        background: '#ffffff',
        surface: '#f5f5f5',
        success: '#4caf50',
        warning: '#ff9800',
        error: '#f44336',
        'text-primary': '#212121',
        'text-secondary': '#757575',
        'text-disabled': '#9e9e9e',
        'user-message': '#e3f2fd',
        'ai-message': '#f5f5f5',
        'error-message': '#ffebee',
        divider: '#e0e0e0',
        border: '#e0e0e0'
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem'
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.5rem',
        'lg': '1rem'
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      },
      animation: {
        'typing': 'typing 1s infinite ease-in-out'
      },
      keyframes: {
        typing: {
          '0%': { transform: 'translateY(0)', opacity: 0.4 },
          '50%': { transform: 'translateY(-5px)', opacity: 1 },
          '100%': { transform: 'translateY(0)', opacity: 0.4 }
        }
      }
    },
  },
  plugins: [],
};
