# Generic MCP Testing Prompts

## Puppeteer MCP Prompts

### Initial Setup & Navigation Testing
```
Using Puppeteer MCP, please:
1. Navigate to [URL/localhost:port] and take a screenshot
2. Test basic navigation by clicking through [specify key navigation elements]
3. Verify that all major pages load without console errors
4. Check that the page title and meta tags are correct
5. Generate a navigation flow report with screenshots at each step
```

### Responsive Design Testing
```
With Puppeteer MCP, test responsive design by:
1. Setting viewport sizes to: 320px, 768px, 1024px, and 1440px widths
2. Taking screenshots of [key pages/components] at each breakpoint
3. Checking for horizontal scroll issues or layout breaks
4. Verifying that interactive elements remain clickable on mobile
5. Testing touch interactions on mobile viewport sizes
6. Generate a responsive testing report with before/after comparisons
```

### Form & Interaction Testing
```
Use Puppeteer MCP to test user interactions:
1. Fill out all forms on [specify pages] with valid and invalid data
2. Test all button clicks, dropdown selections, and input fields
3. Verify form validation messages display correctly
4. Check that form submissions work and show appropriate feedback
5. Test keyboard navigation through interactive elements
6. Capture screenshots of error states and success states
```

### Performance & Loading Testing
```
With Puppeteer MCP, analyze performance:
1. Measure page load times for [key pages]
2. Check for console errors, warnings, or network failures
3. Test loading states and skeleton screens
4. Verify that images and assets load properly
5. Monitor memory usage during user interactions
6. Generate a performance report with metrics and recommendations
```

## Playwright MCP Prompts

### Cross-Browser Testing
```
Using Playwright MCP, perform cross-browser testing:
1. Run the same test suite across Chrome, Firefox, and Safari
2. Compare visual differences with screenshots
3. Test browser-specific features and compatibility
4. Verify that CSS and JavaScript work consistently
5. Check for browser-specific console errors
6. Generate a cross-browser compatibility report
```

### Advanced User Journey Testing
```
With Playwright MCP, test complete user journeys:
1. Simulate a new user onboarding flow from start to finish
2. Test returning user scenarios with different states
3. Verify multi-step processes work end-to-end
4. Test edge cases and error recovery scenarios
5. Capture network requests and responses during the journey
6. Generate a user journey report with success/failure rates
```

### Accessibility Testing
```
Use Playwright MCP for accessibility validation:
1. Check for proper ARIA labels and semantic HTML
2. Test keyboard navigation through all interactive elements
3. Verify color contrast ratios meet WCAG standards
4. Test screen reader compatibility with page structure
5. Check focus management and tab order
6. Generate an accessibility compliance report
```

## Cypress MCP Prompts (if available)

### Component Testing
```
With Cypress MCP, test individual components:
1. Mount [component name] in isolation
2. Test all props and state variations
3. Verify component renders correctly with different data
4. Test user interactions within the component
5. Check component behavior with edge case data
6. Generate component test coverage report
```

### API Integration Testing
```
Using Cypress MCP, test API integrations:
1. Intercept and mock API calls for [endpoints]
2. Test success and error response handling
3. Verify loading states during API calls
4. Test retry logic and timeout handling
5. Check data transformation and display
6. Generate API integration test results
```

## Web Search MCP + Testing Combination

### Deployment Validation
```
Combine Web Search MCP with testing:
1. Search for the deployed application URL
2. Verify the site is accessible publicly
3. Check if the site appears in search results correctly
4. Test that shared links work properly
5. Validate meta tags for social media sharing
6. Generate a deployment validation report
```

## Generic Multi-MCP Testing Workflow

### Comprehensive Testing Suite
```
Using available MCP services, create a comprehensive test suite:

**Phase 1 - Discovery:**
- Use Web Search MCP to verify external dependencies and CDNs
- Check for any reported issues with libraries being used

**Phase 2 - Functional Testing:**
- Use Puppeteer/Playwright MCP to test core functionality
- Verify all user flows work as expected
- Test responsive design across devices

**Phase 3 - Performance Testing:**
- Measure load times and performance metrics
- Check for memory leaks or performance bottlenecks
- Validate optimization implementations

**Phase 4 - Compatibility Testing:**
- Test across different browsers and devices
- Verify backwards compatibility where needed
- Check for accessibility compliance

**Phase 5 - Reporting:**
- Generate consolidated test results
- Provide actionable recommendations
- Create regression test checklist for future updates

Please execute this full testing suite and provide detailed results for each phase.
```

## Customizable Template Prompts

### Quick Smoke Test
```
Using [MCP Service], perform a quick smoke test:
1. Verify [application] loads without errors
2. Test [X critical user paths]
3. Check that [key features] work correctly
4. Take screenshots of [important pages/states]
5. Report any issues found with severity levels
```

### Regression Testing
```
With [MCP Service], run regression tests:
1. Compare current functionality against [baseline/previous version]
2. Test that [existing features] still work after changes
3. Verify no new console errors or warnings appeared
4. Check that performance hasn't degraded
5. Generate a regression test report with pass/fail status
```

### User Acceptance Testing Simulation
```
Using [MCP Service], simulate user acceptance testing:
1. Test the application as if you're [target user persona]
2. Follow typical user workflows for [specific use case]
3. Identify any UX friction or confusing elements
4. Verify that [business requirements] are met
5. Provide user experience feedback and recommendations
```

## How to Use These Prompts

1. **Replace placeholders** like [URL], [component name], [key features] with your specific details
2. **Combine prompts** for comprehensive testing coverage
3. **Adjust complexity** based on your testing needs
4. **Iterate** - use results from one test to inform the next
5. **Save successful combinations** as templates for future projects

These prompts are designed to be framework-agnostic and can be adapted for React, Vue, Angular, or any web application testing needs.