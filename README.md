# DocuTrack - Document-Centric Issue Tracking System

A modern issue tracking system that integrates documentation directly into the workflow, built with React, TypeScript, and Shadcn UI.

## Features

- Project-based organization with tiles (components/features)
- Document-centric issue tracking
- Visual diff highlighting for document changes
- Subtask management
- Clean and intuitive UI inspired by JIRA

## Tech Stack

- React with TypeScript
- Shadcn UI for components
- Tailwind CSS for styling
- React Router for navigation
- React Markdown for rendering documentation

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `/src`
  - `/components` - Reusable UI components
  - `/context` - React Context for state management
  - `/pages` - Main application pages
  - `/types` - TypeScript type definitions
  - `mockData.ts` - Sample data for development
  - `App.tsx` - Main application component
  - `main.tsx` - Application entry point

## Development

The application uses mock data for development. The data structure includes:

- Projects
- Tiles (components/features within projects)
- Issues (with document forking)
- Subtasks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request 

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
