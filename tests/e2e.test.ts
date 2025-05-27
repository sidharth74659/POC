import puppeteer, { Browser, Page } from 'puppeteer';

describe('DocuTrack E2E Tests', () => {
  let browser: Browser;
  let page: Page;
  const baseUrl = 'http://localhost:5173'; // Vite dev server default port

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: process.env.CI === 'true', // Run headless in CI, visible locally
      slowMo: 50, // Slow down actions for better visibility
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    // Set up console logging for debugging
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error('Browser console error:', msg.text());
      }
    });
    
    // Handle page errors
    page.on('pageerror', (error) => {
      console.error('Page error:', error.message);
    });
  });

  afterEach(async () => {
    if (page) {
      await page.close();
    }
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  describe('Projects List Page', () => {
    test('should load and display projects', async () => {
      await page.goto(baseUrl);
      
      // Wait for the page to load
      await page.waitForSelector('h1', { timeout: 10000 });
      
      // Check page title
      const title = await page.$eval('h1', (el) => el.textContent);
      expect(title).toBe('Projects');
      
      // Check that projects are displayed
      const projectCards = await page.$$('[data-testid="project-card"]');
      expect(projectCards.length).toBeGreaterThan(0);
      
      // Take screenshot for visual regression testing
      await page.screenshot({ 
        path: 'tests/screenshots/projects-list.png',
        fullPage: true 
      });
    });

    test('should navigate to project detail when clicking a project', async () => {
      await page.goto(baseUrl);
      
      // Wait for projects to load
      await page.waitForSelector('[data-testid="project-card"]');
      
      // Click on the first project
      await page.click('[data-testid="project-card"]:first-child');
      
      // Wait for navigation
      await page.waitForNavigation();
      
      // Check that we're on the project detail page
      expect(page.url()).toMatch(/\/projects\/p\d+/);
      
      // Check that tiles are displayed
      await page.waitForSelector('[data-testid="tile-list"]');
      const tiles = await page.$$('[data-testid="tile-item"]');
      expect(tiles.length).toBeGreaterThan(0);
    });
  });

  describe('Project Detail Page', () => {
    beforeEach(async () => {
      await page.goto(`${baseUrl}/projects/p1`);
      await page.waitForSelector('[data-testid="tile-list"]');
    });

    test('should display project details and tiles', async () => {
      // Check project name is displayed
      const projectName = await page.$eval('h2', (el) => el.textContent);
      expect(projectName).toBe('E-commerce Platform');
      
      // Check tiles are listed
      const tiles = await page.$$('[data-testid="tile-item"]');
      expect(tiles.length).toBeGreaterThan(0);
      
      // Take screenshot
      await page.screenshot({ 
        path: 'tests/screenshots/project-detail.png',
        fullPage: true 
      });
    });

    test('should show tile details when selecting a tile', async () => {
      // Click on the first tile
      await page.click('[data-testid="tile-item"]:first-child');
      
      // Wait for tile details to load
      await page.waitForSelector('[data-testid="tile-content"]');
      
      // Check that tile content is displayed
      const tileContent = await page.$('[data-testid="tile-content"]');
      expect(tileContent).toBeTruthy();
      
      // Check that template data is displayed
      const templateData = await page.$('[data-testid="template-data"]');
      expect(templateData).toBeTruthy();
      
      // Check that issues table is displayed
      const issuesTable = await page.$('[data-testid="issues-table"]');
      expect(issuesTable).toBeTruthy();
    });

    test('should open create issue modal', async () => {
      // Select a tile first
      await page.click('[data-testid="tile-item"]:first-child');
      await page.waitForSelector('[data-testid="create-issue-btn"]');
      
      // Click create issue button
      await page.click('[data-testid="create-issue-btn"]');
      
      // Wait for modal to open
      await page.waitForSelector('[data-testid="create-issue-modal"]');
      
      // Check modal is visible
      const modal = await page.$('[data-testid="create-issue-modal"]');
      expect(modal).toBeTruthy();
      
      // Take screenshot of modal
      await page.screenshot({ 
        path: 'tests/screenshots/create-issue-modal.png' 
      });
    });

    test('should create a new issue', async () => {
      // Select a tile and open create issue modal
      await page.click('[data-testid="tile-item"]:first-child');
      await page.waitForSelector('[data-testid="create-issue-btn"]');
      await page.click('[data-testid="create-issue-btn"]');
      await page.waitForSelector('[data-testid="create-issue-modal"]');
      
      // Fill in the form
      await page.type('[data-testid="issue-title"]', 'Test Issue');
      await page.select('[data-testid="issue-assignee"]', 'Developer');
      await page.select('[data-testid="issue-priority"]', 'High');
      
      // Modify the document content
      await page.evaluate(() => {
        const textarea = document.querySelector('[data-testid="issue-content"]') as HTMLTextAreaElement;
        if (textarea) {
          textarea.value = textarea.value + '\n\n++This is a test addition++';
        }
      });
      
      // Submit the form
      await page.click('[data-testid="submit-issue"]');
      
      // Wait for modal to close and page to update
      await page.waitForSelector('[data-testid="create-issue-modal"]', { hidden: true });
      
      // Check that the new issue appears in the table
      await page.waitForSelector('[data-testid="issues-table"] tbody tr');
      const issueRows = await page.$$('[data-testid="issues-table"] tbody tr');
      expect(issueRows.length).toBeGreaterThan(0);
    });

    test('should navigate to issue detail', async () => {
      // Select a tile with issues
      await page.click('[data-testid="tile-item"]:first-child');
      await page.waitForSelector('[data-testid="issues-table"] tbody tr');
      
      // Click on the first issue
      await page.click('[data-testid="issues-table"] tbody tr:first-child');
      
      // Wait for navigation
      await page.waitForNavigation();
      
      // Check that we're on the issue detail page
      expect(page.url()).toMatch(/\/projects\/p\d+\/tiles\/t\d+\/issues\/i\d+/);
    });
  });

  describe('Issue Detail Page', () => {
    beforeEach(async () => {
      await page.goto(`${baseUrl}/projects/p1/tiles/t1/issues/i1`);
      await page.waitForSelector('[data-testid="issue-header"]');
    });

    test('should display issue details', async () => {
      // Check issue number and title
      const issueNumber = await page.$eval('[data-testid="issue-number"]', (el) => el.textContent);
      expect(issueNumber).toMatch(/ISSUE-\d+/);
      
      // Check status badge
      const statusBadge = await page.$('[data-testid="status-badge"]');
      expect(statusBadge).toBeTruthy();
      
      // Check forked document content
      const forkedContent = await page.$('[data-testid="forked-content"]');
      expect(forkedContent).toBeTruthy();
      
      // Take screenshot
      await page.screenshot({ 
        path: 'tests/screenshots/issue-detail.png',
        fullPage: true 
      });
    });

    test('should change issue status', async () => {
      // Get current status
      const currentStatus = await page.$eval('[data-testid="status-select"]', (el) => (el as HTMLSelectElement).value);
      
      // Change status
      const newStatus = currentStatus === 'Open' ? 'Development In Progress' : 'Open';
      await page.select('[data-testid="status-select"]', newStatus);
      
      // Wait for update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check that status was updated
      const updatedStatus = await page.$eval('[data-testid="status-select"]', (el) => (el as HTMLSelectElement).value);
      expect(updatedStatus).toBe(newStatus);
    });

    test('should toggle subtask completion', async () => {
      // Find subtask checkboxes
      const subtaskCheckboxes = await page.$$('[data-testid="subtask-checkbox"]');
      
      if (subtaskCheckboxes.length > 0) {
        // Get initial state
        const initialChecked = await page.$eval('[data-testid="subtask-checkbox"]:first-child', (el) => (el as HTMLInputElement).checked);
        
        // Click the checkbox
        await page.click('[data-testid="subtask-checkbox"]:first-child');
        
        // Wait for update
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check that state changed
        const newChecked = await page.$eval('[data-testid="subtask-checkbox"]:first-child', (el) => (el as HTMLInputElement).checked);
        expect(newChecked).toBe(!initialChecked);
      }
    });

    test('should show merge button when issue is closed', async () => {
      // Change status to Closed
      await page.select('[data-testid="status-select"]', 'Closed');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check that merge button appears
      const mergeButton = await page.$('[data-testid="merge-button"]');
      expect(mergeButton).toBeTruthy();
      
      // Take screenshot
      await page.screenshot({ 
        path: 'tests/screenshots/issue-closed-with-merge.png' 
      });
    });
  });

  describe('Responsive Design Tests', () => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1280, height: 720 },
      { name: 'large-desktop', width: 1920, height: 1080 },
    ];

    viewports.forEach(({ name, width, height }) => {
      test(`should be responsive on ${name} (${width}x${height})`, async () => {
        await page.setViewport({ width, height });
        await page.goto(baseUrl);
        
        // Wait for page to load
        await page.waitForSelector('h1');
        
        // Take screenshot for visual regression testing
        await page.screenshot({ 
          path: `tests/screenshots/responsive-${name}.png`,
          fullPage: true 
        });
        
        // Check that content is visible and not overflowing
        const bodyOverflow = await page.evaluate(() => {
          const body = document.body;
          const computedStyle = window.getComputedStyle(body);
          return {
            overflowX: computedStyle.overflowX,
            scrollWidth: body.scrollWidth,
            clientWidth: body.clientWidth
          };
        });
        
        // Ensure no horizontal overflow
        expect(bodyOverflow.scrollWidth).toBeLessThanOrEqual(bodyOverflow.clientWidth + 1); // +1 for rounding
      });
    });
  });

  describe('Performance Tests', () => {
    test('should load pages within acceptable time', async () => {
      const startTime = Date.now();
      
      await page.goto(baseUrl);
      await page.waitForSelector('h1');
      
      const loadTime = Date.now() - startTime;
      
      // Page should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should have good lighthouse scores', async () => {
      // This would require lighthouse integration
      // For now, we'll just check basic performance metrics
      await page.goto(baseUrl);
      
      const performanceMetrics = await page.evaluate(() => {
        return JSON.parse(JSON.stringify(performance.getEntriesByType('navigation')[0]));
      });
      
      // Check that DOM content loaded quickly
      expect(performanceMetrics.domContentLoadedEventEnd - performanceMetrics.domContentLoadedEventStart).toBeLessThan(1000);
    });
  });

  describe('Accessibility Tests', () => {
    test('should have proper heading hierarchy', async () => {
      await page.goto(baseUrl);
      await page.waitForSelector('h1');
      
      const headings = await page.evaluate(() => {
        const headingElements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        return headingElements.map(el => ({
          tag: el.tagName.toLowerCase(),
          text: el.textContent?.trim()
        }));
      });
      
      // Should have at least one h1
      const h1Count = headings.filter(h => h.tag === 'h1').length;
      expect(h1Count).toBeGreaterThanOrEqual(1);
    });

    test('should have proper alt text for images', async () => {
      await page.goto(baseUrl);
      
      const imagesWithoutAlt = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        return images.filter(img => !img.alt || img.alt.trim() === '').length;
      });
      
      expect(imagesWithoutAlt).toBe(0);
    });

    test('should be keyboard navigable', async () => {
      await page.goto(baseUrl);
      await page.waitForSelector('[data-testid="project-card"]');
      
      // Test tab navigation
      await page.keyboard.press('Tab');
      
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.tagName.toLowerCase();
      });
      
      // Should be able to focus on interactive elements
      expect(['a', 'button', 'input', 'select', 'textarea']).toContain(focusedElement);
    });
  });
}); 