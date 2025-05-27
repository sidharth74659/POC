# DocuTrack - Document-Centric Issue Tracking System

DocuTrack is a modern, comprehensive document-centric issue tracking system built with React, TypeScript, and Vite. It features advanced UI components, responsive design, comprehensive testing with Puppeteer MCP integration, and sophisticated functionality for managing documentation projects and issues.

## 🚀 Features

### Core Functionality
- **Project Management**: Create, view, and manage documentation projects
- **Issue Tracking**: Comprehensive issue management with status tracking
- **Document-Centric Workflow**: Issues are tied to specific documentation tiles
- **Visual Diff**: Side-by-side comparison of document changes
- **Template System**: Predefined templates for consistent documentation
- **Responsive Design**: Optimized for mobile, tablet, and desktop

### Advanced Features
- **Shadcn UI Components**: Modern, accessible UI component library
- **Framer Motion Animations**: Smooth transitions and micro-interactions
- **Virtual Scrolling**: Performance-optimized for large datasets
- **Search & Filtering**: Real-time search across projects and issues
- **Dark/Light Theme**: System preference detection and manual toggle
- **Accessibility**: WCAG compliant with keyboard navigation support

## 🛠️ Technical Stack

### Frontend
- **React 18.2.0** with TypeScript
- **Vite 5.1.6** for build tooling
- **Tailwind CSS 3.4.1** for styling
- **Shadcn UI** with Radix UI primitives
- **React Router DOM 6.22.3** for routing
- **Framer Motion 12.15.0** for animations

### Testing & Automation
- **Jest 29.7.0** for unit testing
- **Puppeteer 24.9.0** for E2E testing
- **React Testing Library 16.3.0** for component testing
- **Puppeteer MCP Integration** for advanced browser automation

### Development Tools
- **TypeScript 5.2.2** for type safety
- **ESLint 8.57.0** for code quality
- **PostCSS 8.4.35** with Autoprefixer

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd doctrack

# Install dependencies
npm install

# Install Puppeteer MCP Server globally (for advanced testing)
npm install -g @modelcontextprotocol/server-puppeteer

# Start development server
npm run dev
```

## 🧪 Testing

DocuTrack includes a comprehensive testing suite with multiple testing strategies:

### Test Scripts
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests only
npm run test:e2e

# Generate coverage report
npm run test:coverage

# Run comprehensive manual test runner with Puppeteer
npm run test:manual
```

### Testing Features

#### 1. Unit Tests
- Component rendering and functionality
- Hook behavior validation
- Utility function testing
- Context provider testing

#### 2. Integration Tests
- Component interaction testing
- State management validation
- Mock data structure verification

#### 3. End-to-End Tests (Manual Runner)
- **Visual Regression Testing**: Automated screenshot capture across multiple viewports
- **User Interaction Testing**: Form submission, navigation, and modal interactions
- **Responsive Design Validation**: Testing on Mobile (375x667), Tablet (768x1024), Desktop (1280x720), and Large Desktop (1920x1080)
- **Performance Testing**: Load time validation and DOM size monitoring
- **Accessibility Testing**: Keyboard navigation and ARIA compliance

#### 4. Puppeteer MCP Integration
The manual test runner (`npm run test:manual`) provides:
- Automatic dev server startup
- Comprehensive browser automation
- Visual regression screenshots
- Performance metrics collection
- Detailed test reporting

### Test Coverage
- **Basic Functionality**: Page loading, element visibility, search functionality
- **Navigation**: Route transitions, URL validation, back/forward navigation
- **Interactions**: Search filtering, view mode toggles, form submissions
- **Responsive Design**: Multi-viewport testing with screenshot capture
- **Performance**: Load time validation (< 5 seconds), DOM size monitoring (< 2000 elements)
- **Accessibility**: Heading hierarchy, keyboard navigation, alt text validation

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/                 # Shadcn UI components
│   ├── layout/             # Layout components
│   ├── navigation/         # Navigation components
│   ├── forms/              # Form components
│   ├── issue/              # Issue-specific components
│   ├── project/            # Project-specific components
│   └── tile/               # Tile components
├── pages/                  # Page components
├── contexts/               # React contexts
├── hooks/                  # Custom hooks
├── lib/                    # Utility libraries
├── interfaces/             # TypeScript interfaces
├── constants/              # Application constants
├── services/               # API services
├── themes/                 # Theme configurations
├── utils/                  # Utility functions
└── assets/                 # Static assets
```

## 🎨 UI Components

### Shadcn UI Components
- **Button**: Multiple variants with loading states
- **Card**: Flexible container component
- **Input/Textarea**: Form input components
- **Select**: Dropdown selection component
- **Dialog**: Modal and dialog components
- **Badge**: Status and category indicators
- **Table**: Data display with sorting
- **Accordion**: Collapsible content sections
- **Scroll Area**: Custom scrollbar styling
- **Checkbox/Label**: Form controls

### Custom Components
- **AnimatedCard**: Enhanced card with hover animations
- **EnhancedButton**: Button with advanced interactions
- **AnimatedToggle**: Smooth toggle switches
- **FloatingActionMenu**: Contextual action buttons
- **VirtualList**: Performance-optimized list rendering
- **ResponsiveContainer**: Layout wrapper with breakpoint handling
- **ResponsiveGrid**: Flexible grid system

## 📱 Responsive Design

DocuTrack is built with a mobile-first approach and includes:

- **Breakpoint System**: Tailwind CSS responsive utilities
- **Touch Optimization**: Touch-friendly interactions
- **Viewport Adaptation**: Dynamic layout adjustments
- **Performance Optimization**: Virtual scrolling for large datasets

### Tested Viewports
- **Mobile**: 375x667 (iPhone SE)
- **Tablet**: 768x1024 (iPad)
- **Desktop**: 1280x720 (Standard laptop)
- **Large Desktop**: 1920x1080 (Full HD)

## ♿ Accessibility

- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Focus Management**: Logical focus order and indicators
- **Color Contrast**: WCAG AA compliant color schemes
- **Semantic HTML**: Proper heading hierarchy and landmarks

## 🚀 Performance

### Optimizations
- **Virtual Scrolling**: Efficient rendering for large datasets (>50 items)
- **Memoization**: React.memo and useMemo for performance
- **Code Splitting**: Lazy loading of components
- **Bundle Optimization**: Tree shaking and minification

### Performance Targets
- **Initial Load**: < 3 seconds
- **Route Transitions**: < 500ms
- **Search Results**: < 300ms
- **Modal Opening**: < 200ms

## 🔧 Development

### Available Scripts
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Testing
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run E2E tests only
npm run test:coverage # Generate coverage report
npm run test:manual  # Run comprehensive Puppeteer tests
```

### Code Quality
- **TypeScript**: Strict type checking
- **ESLint**: Code style enforcement
- **Component Architecture**: Modular, reusable components
- **Context-based State Management**: Centralized state with React Context

## 📖 Documentation

- **README.md**: Project overview and setup instructions
- **TESTING.md**: Comprehensive testing guide with examples
- **IMPLEMENTATION_SUMMARY.md**: Detailed technical implementation summary

## 🔮 Future Enhancements

### Planned Features
- **Real-time Collaboration**: WebSocket integration
- **Advanced Search**: Full-text search with filters
- **File Attachments**: Document and image uploads
- **Notification System**: Real-time notifications
- **API Integration**: Backend service integration

### Technical Improvements
- **PWA Support**: Service worker and offline functionality
- **Internationalization**: Multi-language support
- **Advanced Analytics**: User behavior tracking
- **Performance Monitoring**: Real-time performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Shadcn UI** for the excellent component library
- **Radix UI** for accessible primitives
- **Tailwind CSS** for utility-first styling
- **Puppeteer** for browser automation capabilities
- **React Team** for the amazing framework
