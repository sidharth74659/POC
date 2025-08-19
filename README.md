# UI5 Design System

A comprehensive, production-ready design system built with React and SAP UI5 Web Components. This library provides a complete set of accessible, themeable components following modern design principles and SAP Fiori guidelines.

## 🚀 Features

- **Complete Component Library**: Buttons, Cards, Skeleton Loaders, Toast Notifications, and more
- **Advanced Theming**: Light/dark mode with smooth transitions and accessibility compliance (WCAG 2.1 AA)
- **Design Token System**: Comprehensive token architecture for colors, typography, spacing, and more
- **Interactive Documentation**: Full Storybook integration with live examples and prop controls
- **TypeScript Support**: Complete type safety with extensive TypeScript definitions
- **Accessibility First**: All components meet WCAG 2.1 AA standards with proper ARIA attributes
- **Responsive Design**: Mobile-first approach with consistent breakpoints
- **Performance Optimized**: Built on UI5 Web Components for optimal performance

## 📦 Installation

```bash
npm install @ui5/webcomponents-react @ui5/webcomponents @ui5/webcomponents-fiori @ui5/webcomponents-icons
npm install clsx react-hot-toast
```

## 🎨 Design Tokens

The design system is built on a comprehensive token system:

### Colors
- Primary, secondary, and semantic color palettes
- Light and dark theme variants
- Accessible color combinations with proper contrast ratios

### Typography
- Inter font family with multiple weights
- Consistent sizing scale from 12px to 60px
- Optimized line heights for readability

### Spacing
- 8px base unit system for consistent spacing
- Comprehensive spacing scale from 4px to 256px
- Semantic spacing tokens for different use cases

### Shadows & Elevation
- 4-level elevation system
- Subtle shadows for depth without distraction
- Consistent shadow tokens across all components

## 🧩 Components

### Button
Versatile button component with multiple variants and states:

```tsx
import { Button } from './components/Button';

<Button variant="primary" size="medium" loading={false}>
  Click me
</Button>
```

**Variants**: primary, secondary, tertiary, danger, ghost
**Sizes**: small, medium, large
**Features**: Icons, loading states, full-width, accessibility support

### Card
Flexible container for grouping related content:

```tsx
import { Card } from './components/Card';

<Card 
  title="Card Title" 
  subtitle="Subtitle" 
  variant="elevated"
  footer={<Button>Action</Button>}
>
  Card content goes here
</Card>
```

**Variants**: default, elevated, outlined
**Features**: Headers, footers, clickable cards, custom padding

### Skeleton Loader
Maintain layout during loading states:

```tsx
import { SkeletonLoader } from './components/SkeletonLoader';

<SkeletonLoader variant="card" />
<SkeletonLoader variant="text" lines={3} />
<SkeletonLoader variant="table" />
```

**Variants**: text, circular, rectangular, button, card, table
**Features**: Custom dimensions, animation timing, responsive design

### Toast Notifications
Contextual user feedback with auto-dismiss:

```tsx
import { useToast } from './components/Toast';

const toast = useToast();

toast.success('Operation completed successfully!');
toast.error('Something went wrong');
toast.warning('Please check your input');
toast.info('Here\'s some helpful information');
```

**Types**: success, error, warning, info
**Features**: Auto-dismiss, custom duration, dismissible option

## 🎭 Theming

### Theme Provider Setup

```tsx
import { ThemeProvider } from './context/ThemeContext';
import { ThemeProvider as UI5ThemeProvider } from '@ui5/webcomponents-react';

function App() {
  return (
    <ThemeProvider>
      <UI5ThemeProvider>
        <YourApp />
      </UI5ThemeProvider>
    </ThemeProvider>
  );
}
```

### Using the Theme Hook

```tsx
import { useTheme } from './context/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button onClick={toggleTheme}>
      {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    </Button>
  );
}
```

## 📚 Storybook Documentation

Launch the interactive documentation:

```bash
npm run storybook
```

The Storybook includes:
- Live component previews with prop controls
- Accessibility testing with automated checks
- Code examples and implementation guides
- Design guidelines and usage recommendations
- Interactive state demonstrations

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run storybook` - Launch Storybook
- `npm run build-storybook` - Build Storybook for deployment
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/           # Component library
│   ├── Button/
│   ├── Card/
│   ├── SkeletonLoader/
│   └── Toast/
├── context/             # React contexts
│   └── ThemeContext.tsx
├── tokens/              # Design tokens
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── shadows.ts
├── showcase/            # Demo application
└── stories/             # Storybook stories
```

## ♿ Accessibility

All components are built with accessibility as a priority:

- **WCAG 2.1 AA Compliance**: Color contrast ratios meet or exceed 4.5:1
- **Keyboard Navigation**: Full keyboard support with proper focus management
- **Screen Reader Support**: Comprehensive ARIA attributes and semantic HTML
- **Focus Management**: Visible focus indicators and logical tab order
- **High Contrast Support**: Components work well in high contrast modes

## 🔧 Customization

### Extending the Token System

```tsx
import { designTokens } from './tokens';

// Extend color tokens
const customTokens = {
  ...designTokens,
  colors: {
    ...designTokens.colors,
    brand: {
      50: '#fff1f2',
      500: '#ef4444',
      900: '#7f1d1d',
    }
  }
};
```

### Custom Component Variants

```tsx
import { Button, ButtonProps } from './components/Button';
import { clsx } from 'clsx';

interface CustomButtonProps extends ButtonProps {
  gradient?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({ 
  gradient, 
  className, 
  ...props 
}) => {
  return (
    <Button
      {...props}
      className={clsx(className, {
        'custom-gradient-button': gradient,
      })}
    />
  );
};
```

## 🚀 Production Usage

### Building the Library

```bash
npm run build
```

### Integration Examples

```tsx
// Basic usage
import { Button, Card, useToast } from 'ui5-design-system';

// With theme support
import { ThemeProvider } from 'ui5-design-system/context';

// Individual component imports for tree-shaking
import { Button } from 'ui5-design-system/components/Button';
```

## 📄 License

MIT License - feel free to use this design system in your projects.

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines and submit pull requests for any improvements.

## 📞 Support

For questions and support:
- Check the Storybook documentation
- Review component examples
- Open an issue for bugs or feature requests

---

Built with ❤️ using React, TypeScript, and UI5 Web Components.