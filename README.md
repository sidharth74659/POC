# DocuTrack - Document-Centric Issue Tracking System

A modern React application built with TypeScript and Shadcn UI that provides a document-centric approach to issue tracking, inspired by JIRA's workflow but focused on documentation management.

## 🚀 Features

- **Project Management**: Organize work into projects with multiple tiles
- **Document-Centric Workflow**: Each tile contains canonical documentation that can be forked for issues
- **Issue Tracking**: Create issues by forking documents with visual diff markers
- **Visual Diff Support**: Track changes with `++additions++`, `--removals--`, and `~~modifications~~`
- **Subtask Management**: Break down issues into manageable subtasks
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Comprehensive Testing**: Automated E2E testing with Puppeteer and visual regression testing

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **UI Components**: Shadcn UI + Tailwind CSS
- **Routing**: React Router DOM
- **Markdown**: React Markdown for document rendering
- **Testing**: Jest + Puppeteer for E2E testing
- **Build Tool**: Vite
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd doctrack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🧪 Testing with Puppeteer MCP

This project includes comprehensive automated testing using Puppeteer MCP (Model Context Protocol) for browser automation, visual regression testing, and functional validation.

### Prerequisites

1. **Install Puppeteer MCP Server globally**
   ```bash
   npm install -g @modelcontextprotocol/server-puppeteer
   ```

2. **Configure Claude Desktop (Optional)**
   Add the following to your Claude Desktop configuration:
   ```json
   {
     "mcpServers": {
       "puppeteer": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
       }
     }
   }
   ```

### Running Tests

#### 1. Manual Test Runner (Recommended)
Run the comprehensive test suite with visual browser:
```bash
npm run test:manual
```

This will:
- Start the Vite dev server automatically
- Launch a browser window (visible for debugging)
- Run all test scenarios
- Capture screenshots for visual regression
- Generate detailed console output

#### 2. Jest E2E Tests
Run the full Jest test suite:
```bash
npm run test:e2e
```

#### 3. Watch Mode
Run tests in watch mode for development:
```bash
npm run test:watch
```

#### 4. Coverage Report
Generate test coverage report:
```bash
npm run test:coverage
```

### Test Scenarios Covered

#### 🔍 **Basic Functionality Tests**
- Projects list page loads correctly
- Project cards are visible and clickable
- Navigation between pages works

#### 🧭 **Navigation Tests**
- Project detail page navigation
- Tile selection and display
- Issue detail page navigation
- Breadcrumb navigation

#### 🎯 **Interaction Tests**
- Create issue modal functionality
- Form filling and validation
- Issue creation workflow
- Status changes and updates
- Subtask management

#### 📱 **Responsive Design Tests**
- Mobile viewport (375x667)
- Tablet viewport (768x1024)
- Desktop viewport (1280x720)
- Large desktop viewport (1920x1080)

#### ⚡ **Performance Tests**
- Page load times
- DOM content loaded metrics
- Basic Lighthouse score validation

#### ♿ **Accessibility Tests**
- Proper heading hierarchy
- Alt text for images
- Keyboard navigation support
- Focus management

### Visual Regression Testing

Screenshots are automatically captured during tests and saved to `tests/screenshots/`:

- `projects-list.png` - Main projects page
- `project-detail.png` - Project detail view
- `create-issue-modal.png` - Issue creation modal
- `issue-detail.png` - Issue detail page
- `responsive-*.png` - Various viewport sizes

### Test Configuration

The testing setup includes:

- **Jest Configuration**: `jest.config.js`
- **Test Setup**: `tests/setup.ts`
- **E2E Tests**: `tests/e2e.test.ts`
- **Manual Test Runner**: `test-runner.js`

## 🏗️ Project Structure

```
src/
├── components/
│   └── ui/                 # Shadcn UI components
├── context/
│   └── AppContext.tsx      # Global state management
├── pages/
│   ├── ProjectsListPage.tsx
│   ├── ProjectDetailPage.tsx
│   └── IssueDetailPage.tsx
├── types.ts                # TypeScript type definitions
├── mockData.ts             # Mock data generation
└── App.tsx                 # Main application component

tests/
├── e2e.test.ts            # Comprehensive E2E tests
├── setup.ts               # Test configuration
└── screenshots/           # Visual regression screenshots
```

## 🎨 UI Components

The application uses Shadcn UI components for a consistent, modern interface:

- **Cards**: Project and tile containers
- **Buttons**: Actions and navigation
- **Badges**: Status and priority indicators
- **Tables**: Issue listings
- **Dialogs**: Modal forms
- **Select**: Dropdown menus
- **Input/Textarea**: Form fields
- **Accordion**: Collapsible sections
- **Checkbox**: Task completion

## 📊 Data Models

### Project
- `id`: Unique identifier
- `name`: Project name
- `purpose`: Project description
- `tileCount`: Number of tiles

### Tile
- `id`: Unique identifier
- `projectId`: Parent project
- `name`: Tile name
- `mainDocumentContent`: Canonical documentation (Markdown)
- `templateData`: Structured metadata (intent, scenario, flow, APIs, etc.)

### Issue
- `id`: Unique identifier
- `tileId`: Parent tile
- `issueNumber`: Human-readable issue number
- `title`: Issue title
- `assignee`: Assigned person
- `priority`: High/Medium/Low
- `status`: Open/In Progress/Testing/Closed
- `forkedDocumentContent`: Modified documentation with diff markers
- `tags`: Optional tags
- `createdAt`: Creation timestamp

### SubTask
- `id`: Unique identifier
- `issueId`: Parent issue
- `description`: Task description
- `status`: Open/Closed

## 🔄 Workflow

1. **Browse Projects**: View all available projects
2. **Select Project**: Navigate to project detail page
3. **Choose Tile**: Select a tile to view its documentation
4. **Create Issue**: Fork the tile's document to create an issue
5. **Modify Content**: Edit the forked document with diff markers
6. **Track Progress**: Manage issue status and subtasks
7. **Merge Changes**: When complete, merge changes back to the main document

## 🎯 Diff Markers

The application supports visual diff markers in Markdown content:

- `++Added text++` - Highlighted in green
- `--Removed text--` - Highlighted in red with strikethrough
- `~~Modified text~~` - Highlighted in orange

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Preview the build**
   ```bash
   npm run preview
   ```

3. **Deploy** the `dist` folder to your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the test suite: `npm run test:manual`
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🔧 Development

### Adding New Components

1. Use Shadcn UI CLI to add components:
   ```bash
   npx shadcn@latest add [component-name]
   ```

2. Import and use in your components:
   ```tsx
   import { Button } from '@/components/ui/button'
   ```

### Testing New Features

1. Add data-testid attributes to new elements
2. Update the E2E test suite in `tests/e2e.test.ts`
3. Run tests to ensure functionality works
4. Add visual regression screenshots if needed

### State Management

The application uses React Context for state management. See `src/context/AppContext.tsx` for the implementation.

## 🐛 Troubleshooting

### Common Issues

1. **Tests failing**: Ensure the dev server is running on port 5173
2. **Screenshots not generating**: Check that the `tests/screenshots` directory exists
3. **Puppeteer issues**: Try running with `--no-sandbox` flag in CI environments
4. **Component imports failing**: Verify the path alias configuration in `vite.config.ts`

### Debug Mode

Run tests with visible browser for debugging:
```bash
# Edit test-runner.js and set headless: false
npm run test:manual
```

## 📚 Additional Resources

- [Shadcn UI Documentation](https://ui.shadcn.com/)
- [Puppeteer Documentation](https://pptr.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)
