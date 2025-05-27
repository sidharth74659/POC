# DocuTrack Testing Guide

This document provides comprehensive information about testing the DocuTrack application using Puppeteer MCP and other testing tools.

## 🧪 Testing Overview

DocuTrack includes multiple layers of testing to ensure reliability, performance, and user experience:

1. **End-to-End (E2E) Testing** with Puppeteer
2. **Visual Regression Testing** with screenshot comparison
3. **Functional Validation** of user workflows
4. **Responsive Design Testing** across multiple viewports
5. **Performance Testing** for load times and metrics
6. **Accessibility Testing** for WCAG compliance

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v18 or higher)
2. **Puppeteer MCP Server**:
   ```bash
   npm install -g @modelcontextprotocol/server-puppeteer
   ```

### Running Tests

```bash
# Install dependencies
npm install

# Run comprehensive test suite (recommended)
npm run test:manual

# Run Jest E2E tests
npm run test:e2e

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🔧 Test Configuration

### Jest Configuration (`jest.config.js`)

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/*.(test|spec).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 30000,
};
```

### Puppeteer Configuration

```javascript
const browser = await puppeteer.launch({
  headless: process.env.CI === 'true', // Headless in CI, visible locally
  slowMo: 50, // Slow down for better visibility
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
```

## 📋 Test Scenarios

### 1. Basic Functionality Tests

**Purpose**: Verify core application functionality

**Test Cases**:
- ✅ Projects list page loads correctly
- ✅ Project cards are visible and contain correct data
- ✅ Page title and headers are correct
- ✅ Navigation elements are present

**Example**:
```javascript
test('should load and display projects', async () => {
  await page.goto(baseUrl);
  await page.waitForSelector('h1', { timeout: 10000 });
  
  const title = await page.$eval('h1', (el) => el.textContent);
  expect(title).toBe('Projects');
  
  const projectCards = await page.$$('[data-testid="project-card"]');
  expect(projectCards.length).toBeGreaterThan(0);
});
```

### 2. Navigation Tests

**Purpose**: Ensure proper routing and page transitions

**Test Cases**:
- ✅ Navigate from projects list to project detail
- ✅ Navigate from project detail to issue detail
- ✅ Browser back/forward navigation works
- ✅ URL parameters are handled correctly

**Example**:
```javascript
test('should navigate to project detail when clicking a project', async () => {
  await page.goto(baseUrl);
  await page.waitForSelector('[data-testid="project-card"]');
  
  await page.click('[data-testid="project-card"]:first-child');
  await page.waitForNavigation();
  
  expect(page.url()).toMatch(/\/projects\/p\d+/);
});
```

### 3. Interaction Tests

**Purpose**: Validate user interactions and form submissions

**Test Cases**:
- ✅ Create issue modal opens and closes
- ✅ Form fields can be filled and validated
- ✅ Issue creation workflow completes successfully
- ✅ Status changes update correctly
- ✅ Subtask management works

**Example**:
```javascript
test('should create a new issue', async () => {
  // Navigate to project and select tile
  await page.click('[data-testid="tile-item"]:first-child');
  await page.click('[data-testid="create-issue-btn"]');
  
  // Fill form
  await page.type('[data-testid="issue-title"]', 'Test Issue');
  await page.select('[data-testid="issue-assignee"]', 'Developer');
  
  // Submit
  await page.click('[data-testid="submit-issue"]');
  
  // Verify creation
  await page.waitForSelector('[data-testid="issues-table"] tbody tr');
});
```

### 4. Responsive Design Tests

**Purpose**: Ensure application works across different screen sizes

**Viewports Tested**:
- 📱 Mobile: 375x667
- 📱 Tablet: 768x1024
- 💻 Desktop: 1280x720
- 🖥️ Large Desktop: 1920x1080

**Test Cases**:
- ✅ Layout adapts to different screen sizes
- ✅ No horizontal overflow occurs
- ✅ Touch targets are appropriately sized
- ✅ Content remains accessible

**Example**:
```javascript
test('should be responsive on mobile', async () => {
  await page.setViewport({ width: 375, height: 667 });
  await page.goto(baseUrl);
  
  const bodyOverflow = await page.evaluate(() => {
    const body = document.body;
    return {
      scrollWidth: body.scrollWidth,
      clientWidth: body.clientWidth
    };
  });
  
  expect(bodyOverflow.scrollWidth).toBeLessThanOrEqual(bodyOverflow.clientWidth + 1);
});
```

### 5. Performance Tests

**Purpose**: Validate application performance metrics

**Test Cases**:
- ✅ Page load times under 3 seconds
- ✅ DOM content loaded quickly
- ✅ No memory leaks in navigation
- ✅ Efficient resource loading

**Example**:
```javascript
test('should load pages within acceptable time', async () => {
  const startTime = Date.now();
  
  await page.goto(baseUrl);
  await page.waitForSelector('h1');
  
  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThan(3000);
});
```

### 6. Accessibility Tests

**Purpose**: Ensure application is accessible to all users

**Test Cases**:
- ✅ Proper heading hierarchy (h1, h2, h3...)
- ✅ Alt text for all images
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ ARIA labels where appropriate

**Example**:
```javascript
test('should be keyboard navigable', async () => {
  await page.goto(baseUrl);
  await page.keyboard.press('Tab');
  
  const focusedElement = await page.evaluate(() => {
    return document.activeElement?.tagName.toLowerCase();
  });
  
  expect(['a', 'button', 'input', 'select']).toContain(focusedElement);
});
```

## 📸 Visual Regression Testing

### Screenshot Capture

Screenshots are automatically captured during test runs:

```javascript
await page.screenshot({ 
  path: 'tests/screenshots/projects-list.png',
  fullPage: true 
});
```

### Screenshot Locations

- `tests/screenshots/projects-list.png` - Main projects page
- `tests/screenshots/project-detail.png` - Project detail view
- `tests/screenshots/create-issue-modal.png` - Issue creation modal
- `tests/screenshots/issue-detail.png` - Issue detail page
- `tests/screenshots/responsive-*.png` - Various viewport sizes

### Visual Comparison

To compare screenshots across test runs:

1. **Baseline**: First run creates baseline screenshots
2. **Comparison**: Subsequent runs can be compared against baseline
3. **Diff Detection**: Use tools like `pixelmatch` for automated comparison

## 🎯 Test Data Management

### Data-TestId Strategy

All interactive elements include `data-testid` attributes:

```tsx
<Button data-testid="create-issue-btn">
  Create New Issue
</Button>

<Card data-testid="project-card">
  {/* Project content */}
</Card>
```

### Mock Data

Tests use the same mock data as the application:

```javascript
import { mockData } from '../src/mockData';

// Access projects, tiles, issues, subtasks
const projects = mockData.projects;
```

## 🚨 Error Handling

### Console Error Monitoring

```javascript
page.on('console', (msg) => {
  if (msg.type() === 'error') {
    console.error('Browser console error:', msg.text());
  }
});
```

### Page Error Handling

```javascript
page.on('pageerror', (error) => {
  console.error('Page error:', error.message);
});
```

## 🔄 Continuous Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Run E2E tests
      run: npm run test:e2e
      env:
        CI: true
```

## 🛠️ Debugging Tests

### Local Debugging

1. **Visible Browser**: Set `headless: false` in Puppeteer config
2. **Slow Motion**: Use `slowMo: 250` for slower execution
3. **Console Logs**: Monitor browser console for errors
4. **Screenshots**: Capture screenshots at failure points

### Debug Commands

```bash
# Run with visible browser
npm run test:manual

# Run specific test file
npx jest tests/e2e.test.ts --verbose

# Run with coverage
npm run test:coverage
```

### Common Issues

1. **Timeout Errors**: Increase `testTimeout` in Jest config
2. **Element Not Found**: Verify `data-testid` attributes exist
3. **Navigation Issues**: Ensure proper `waitForNavigation()` usage
4. **Screenshot Failures**: Check directory permissions

## 📊 Test Reporting

### Coverage Reports

```bash
npm run test:coverage
```

Generates coverage reports in:
- `coverage/lcov-report/index.html` - HTML report
- `coverage/lcov.info` - LCOV format
- `coverage/coverage-final.json` - JSON format

### Test Results

Jest provides detailed test results:

```
PASS tests/e2e.test.ts
  DocuTrack E2E Tests
    Projects List Page
      ✓ should load and display projects (2.5s)
      ✓ should navigate to project detail (1.8s)
    Project Detail Page
      ✓ should display project details and tiles (1.2s)
      ✓ should create a new issue (3.1s)
```

## 🎯 Best Practices

### 1. Test Organization

- Group related tests in `describe` blocks
- Use descriptive test names
- Keep tests independent and isolated
- Clean up after each test

### 2. Selector Strategy

- Prefer `data-testid` over CSS selectors
- Use semantic selectors when possible
- Avoid brittle selectors (classes, IDs)

### 3. Assertions

- Use specific assertions (`toBe`, `toMatch`)
- Test both positive and negative cases
- Verify state changes after actions

### 4. Performance

- Use `waitForSelector` instead of fixed delays
- Minimize unnecessary page loads
- Reuse browser instances when possible

### 5. Maintenance

- Update tests when UI changes
- Keep test data synchronized with application
- Regular review and refactoring

## 📚 Additional Resources

- [Puppeteer Documentation](https://pptr.dev/)
- [Jest Testing Framework](https://jestjs.io/)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Performance Testing Guide](https://web.dev/performance/)

## 🤝 Contributing to Tests

1. **Add Tests**: When adding new features, include corresponding tests
2. **Update Existing**: Modify tests when changing functionality
3. **Documentation**: Update this guide when adding new test patterns
4. **Review**: Ensure tests pass before submitting PRs

---

For questions or issues with testing, please refer to the main README.md or open an issue in the repository. 