# DocuTrack Testing Guide

This guide covers comprehensive testing for the DocuTrack application, including Puppeteer MCP integration for automated E2E testing, visual regression testing, and performance validation.

## Table of Contents

1. [Test Setup](#test-setup)
2. [Test Types](#test-types)
3. [Puppeteer MCP Integration](#puppeteer-mcp-integration)
4. [Running Tests](#running-tests)
5. [Test Scenarios](#test-scenarios)
6. [Visual Regression Testing](#visual-regression-testing)
7. [Performance Testing](#performance-testing)
8. [Accessibility Testing](#accessibility-testing)
9. [Debugging Tests](#debugging-tests)
10. [Best Practices](#best-practices)

## Test Setup

### Prerequisites

1. **Node.js Dependencies**:
   ```bash
   npm install
   ```

2. **Puppeteer MCP Server** (Global Installation):
   ```bash
   npm install -g @modelcontextprotocol/server-puppeteer
   ```

3. **Development Server**:
   ```bash
   npm run dev
   ```

### Test Configuration

The project uses Jest with Puppeteer for E2E testing:

- **Jest Config**: `jest.config.js`
- **Test Setup**: `tests/setup.ts`
- **E2E Tests**: `tests/e2e.test.ts`
- **Unit Tests**: `tests/unit.test.ts`

## Test Types

### 1. Unit Tests
- Component rendering tests
- Hook functionality tests
- Utility function tests
- Context provider tests

### 2. Integration Tests
- Component interaction tests
- API integration tests
- State management tests

### 3. End-to-End Tests
- Full user workflow tests
- Cross-page navigation tests
- Form submission tests
- Modal interactions

### 4. Visual Regression Tests
- Screenshot comparisons
- Layout consistency tests
- Responsive design validation

### 5. Performance Tests
- Load time measurements
- DOM size validation
- Memory usage monitoring

### 6. Accessibility Tests
- Keyboard navigation
- Screen reader compatibility
- ARIA attributes validation

## Puppeteer MCP Integration

### Configuration

The Puppeteer MCP server enables advanced browser automation and testing capabilities:

```javascript
// Browser launch configuration
const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null,
  args: ['--start-maximized']
});
```

### Key Features

1. **Visual Testing**: Automated screenshot capture
2. **Interaction Testing**: Click, type, scroll automation
3. **Performance Monitoring**: Load time and resource usage
4. **Accessibility Validation**: Keyboard navigation and ARIA testing

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode
```bash
npm run test:watch
```

### E2E Tests Only
```bash
npm run test:e2e
```

### Coverage Report
```bash
npm run test:coverage
```

### Manual Test Runner
```bash
npm run test:manual
```

## Test Scenarios

### Basic Functionality Tests

#### 1. Page Loading
```javascript
test('should load the projects page', async () => {
  await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 });
  const title = await page.title();
  expect(title).toContain('DocuTrack');
});
```

#### 2. Project Cards Display
```javascript
test('should display project cards', async () => {
  const projectCards = await page.$$('[data-testid="project-card"]');
  expect(projectCards.length).toBeGreaterThan(0);
});
```

#### 3. Search Functionality
```javascript
test('should show search functionality', async () => {
  const searchInput = await page.$('input[placeholder*="Search"]');
  expect(searchInput).toBeTruthy();
  
  await searchInput?.type('Test');
  await new Promise(resolve => setTimeout(resolve, 500));
});
```

### Navigation Tests

#### 1. Project Detail Navigation
```javascript
test('should navigate to project detail page', async () => {
  await page.waitForSelector('[data-testid="project-card"]');
  const firstProject = await page.$('[data-testid="project-card"]');
  await firstProject?.click();
  
  await page.waitForFunction(() => window.location.pathname.includes('/projects/'));
  const url = page.url();
  expect(url).toMatch(/\/projects\/\w+/);
});
```

#### 2. Back Navigation
```javascript
test('should navigate back to projects list', async () => {
  // Navigate to project detail
  await page.waitForSelector('[data-testid="project-card"]');
  const firstProject = await page.$('[data-testid="project-card"]');
  await firstProject?.click();
  
  await page.waitForFunction(() => window.location.pathname.includes('/projects/'));
  
  // Navigate back
  await page.goBack();
  await page.waitForFunction(() => window.location.pathname === '/');
  
  const projectCards = await page.$$('[data-testid="project-card"]');
  expect(projectCards.length).toBeGreaterThan(0);
});
```

### Interaction Tests

#### 1. Search Filtering
```javascript
test('should filter projects using search', async () => {
  await page.waitForSelector('[data-testid="project-card"]');
  const initialCards = await page.$$('[data-testid="project-card"]');
  const initialCount = initialCards.length;
  
  const searchInput = await page.$('input[placeholder*="Search"]');
  await searchInput?.type('Documentation');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const filteredCards = await page.$$('[data-testid="project-card"]');
  expect(filteredCards.length).toBeLessThanOrEqual(initialCount);
});
```

#### 2. View Mode Toggle
```javascript
test('should toggle view modes', async () => {
  await page.waitForSelector('[data-testid="project-card"]');
  
  const gridButton = await page.$('button[aria-label*="grid"], button:has(svg)');
  const listButton = await page.$('button[aria-label*="list"], button:has(svg)');
  
  if (gridButton && listButton) {
    await listButton.click();
    await new Promise(resolve => setTimeout(resolve, 300));
    
    await gridButton.click();
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  const projectCards = await page.$$('[data-testid="project-card"]');
  expect(projectCards.length).toBeGreaterThan(0);
});
```

## Visual Regression Testing

### Responsive Design Testing

The test suite automatically captures screenshots across multiple viewports:

```javascript
const viewports = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1280, height: 720 },
  { name: 'Large Desktop', width: 1920, height: 1080 }
];

viewports.forEach(viewport => {
  test(`should render correctly on ${viewport.name}`, async () => {
    await page.setViewport({ width: viewport.width, height: viewport.height });
    await page.reload();
    await page.waitForSelector('[data-testid="project-card"]');
    
    // Take screenshot for visual regression
    await page.screenshot({
      path: `tests/screenshots/${viewport.name.toLowerCase()}-projects-list.png`,
      fullPage: true
    });
    
    // Check if elements are visible
    const projectCards = await page.$$('[data-testid="project-card"]');
    expect(projectCards.length).toBeGreaterThan(0);
  });
});
```

### Screenshot Storage

Screenshots are automatically saved to `tests/screenshots/` directory:
- `mobile-projects-list.png`
- `tablet-projects-list.png`
- `desktop-projects-list.png`
- `large-desktop-projects-list.png`

## Performance Testing

### Load Time Validation
```javascript
test('should load within acceptable time', async () => {
  const startTime = Date.now();
  await page.goto(baseUrl);
  await page.waitForSelector('[data-testid="project-card"]');
  const loadTime = Date.now() - startTime;
  
  expect(loadTime).toBeLessThan(5000); // 5 seconds max
});
```

### DOM Size Monitoring
```javascript
test('should have reasonable DOM size', async () => {
  await page.waitForSelector('[data-testid="project-card"]');
  const domSize = await page.evaluate(() => {
    return document.querySelectorAll('*').length;
  });
  
  expect(domSize).toBeLessThan(2000); // Reasonable DOM size
});
```

## Accessibility Testing

### Heading Hierarchy
```javascript
test('should have proper heading hierarchy', async () => {
  await page.waitForSelector('h1');
  const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', 
    elements => elements.map(el => el.tagName)
  );
  
  expect(headings).toContain('H1');
});
```

### Keyboard Navigation
```javascript
test('should support keyboard navigation', async () => {
  await page.waitForSelector('[data-testid="project-card"]');
  
  // Test Tab navigation
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  
  const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
  expect(focusedElement).toBeTruthy();
});
```

### Alt Text Validation
```javascript
test('should have alt text for images', async () => {
  const images = await page.$$('img');
  for (const img of images) {
    const alt = await page.evaluate(el => el.getAttribute('alt'), img);
    expect(alt).toBeTruthy();
  }
});
```

## Debugging Tests

### Running Tests with Visible Browser
```javascript
const browser = await puppeteer.launch({
  headless: false,  // Shows browser window
  defaultViewport: null,
  args: ['--start-maximized']
});
```

### Adding Debug Points
```javascript
// Add breakpoints in tests
await page.waitForSelector('[data-testid="project-card"]');
debugger; // Pauses execution
```

### Console Logging
```javascript
// Log page console messages
page.on('console', msg => console.log('PAGE LOG:', msg.text()));
```

### Screenshot on Failure
```javascript
afterEach(async () => {
  if (page && global.jasmine?.currentSpec?.failedExpectations?.length > 0) {
    await page.screenshot({ 
      path: `tests/screenshots/failure-${Date.now()}.png` 
    });
  }
  if (page) {
    await page.close();
  }
});
```

## Best Practices

### 1. Test Data Management
- Use consistent test data
- Clean up after tests
- Avoid dependencies between tests

### 2. Selector Strategy
- Use `data-testid` attributes for reliable element selection
- Avoid CSS selectors that may change
- Use semantic selectors when possible

### 3. Wait Strategies
- Use `waitForSelector` for element presence
- Use `waitForFunction` for custom conditions
- Avoid fixed timeouts when possible

### 4. Error Handling
- Implement proper error boundaries
- Test error scenarios
- Validate error messages

### 5. Performance Considerations
- Run tests in parallel when possible
- Use headless mode for CI/CD
- Optimize test execution time

### 6. Maintenance
- Keep tests up to date with UI changes
- Review and update test scenarios regularly
- Monitor test execution times

## Continuous Integration

### GitHub Actions Example
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run test:e2e
```

### Test Reports
- Jest generates detailed test reports
- Screenshots are saved for visual validation
- Coverage reports show test completeness

## Troubleshooting

### Common Issues

1. **Browser Launch Failures**
   - Check Puppeteer installation
   - Verify system dependencies
   - Try different launch options

2. **Selector Not Found**
   - Verify element exists
   - Check timing issues
   - Use proper wait strategies

3. **Timeout Errors**
   - Increase timeout values
   - Check network conditions
   - Verify page load completion

4. **Screenshot Differences**
   - Check viewport settings
   - Verify font rendering
   - Consider browser differences

### Getting Help

- Check Jest documentation
- Review Puppeteer API docs
- Consult testing best practices
- Use browser developer tools for debugging 