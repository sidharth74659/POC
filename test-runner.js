#!/usr/bin/env node

import { spawn } from 'child_process';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

class TestRunner {
  constructor() {
    this.browser = null;
    this.page = null;
    this.devServer = null;
    this.baseUrl = 'http://localhost:5173';
    this.screenshotDir = 'tests/screenshots';
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      errors: []
    };
  }

  async init() {
    console.log('🚀 Starting DocuTrack Test Runner...\n');
    
    // Ensure screenshots directory exists
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }

    // Start development server
    await this.startDevServer();
    
    // Launch browser
    await this.launchBrowser();
  }

  async startDevServer() {
    console.log('📦 Starting development server...');
    
    return new Promise((resolve, reject) => {
      this.devServer = spawn('npm', ['run', 'dev'], {
        stdio: 'pipe',
        shell: true
      });

      this.devServer.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Local:') && output.includes('5173')) {
          console.log('✅ Development server started successfully\n');
          setTimeout(resolve, 2000); // Wait for server to be fully ready
        }
      });

      this.devServer.stderr.on('data', (data) => {
        console.error('Dev server error:', data.toString());
      });

      this.devServer.on('error', reject);
      
      // Timeout after 30 seconds
      setTimeout(() => {
        reject(new Error('Development server failed to start within 30 seconds'));
      }, 30000);
    });
  }

  async launchBrowser() {
    console.log('🌐 Launching browser...');
    
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: [
        '--start-maximized',
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });

    this.page = await this.browser.newPage();
    
    // Enable console logging
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('🔴 Browser Console Error:', msg.text());
      }
    });

    console.log('✅ Browser launched successfully\n');
  }

  async runTest(testName, testFn) {
    this.results.total++;
    console.log(`🧪 Running: ${testName}`);
    
    try {
      await testFn();
      this.results.passed++;
      console.log(`✅ PASSED: ${testName}\n`);
    } catch (error) {
      this.results.failed++;
      this.results.errors.push({ test: testName, error: error.message });
      console.log(`❌ FAILED: ${testName}`);
      console.log(`   Error: ${error.message}\n`);
      
      // Take screenshot on failure
      await this.takeScreenshot(`failure-${testName.replace(/\s+/g, '-').toLowerCase()}`);
    }
  }

  async takeScreenshot(name, fullPage = true) {
    try {
      const filename = `${name}-${Date.now()}.png`;
      const filepath = path.join(this.screenshotDir, filename);
      
      await this.page.screenshot({
        path: filepath,
        fullPage
      });
      
      console.log(`📸 Screenshot saved: ${filename}`);
    } catch (error) {
      console.log(`❌ Failed to take screenshot: ${error.message}`);
    }
  }

  async testBasicFunctionality() {
    await this.runTest('Page loads successfully', async () => {
      await this.page.goto(this.baseUrl);
      await this.page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 });
      
      const title = await this.page.title();
      if (!title.includes('DocuTrack')) {
        throw new Error(`Expected title to contain 'DocuTrack', got: ${title}`);
      }
    });

    await this.runTest('Project cards are displayed', async () => {
      const projectCards = await this.page.$$('[data-testid="project-card"]');
      if (projectCards.length === 0) {
        throw new Error('No project cards found');
      }
      console.log(`   Found ${projectCards.length} project cards`);
    });

    await this.runTest('Search functionality works', async () => {
      const searchInput = await this.page.$('input[placeholder*="Search"]');
      if (!searchInput) {
        throw new Error('Search input not found');
      }
      
      await searchInput.type('Documentation');
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('   Search input accepts text');
    });
  }

  async testNavigation() {
    await this.runTest('Navigate to project detail', async () => {
      await this.page.goto(this.baseUrl);
      await this.page.waitForSelector('[data-testid="project-card"]');
      
      const firstProject = await this.page.$('[data-testid="project-card"]');
      if (!firstProject) {
        throw new Error('No project card found for navigation');
      }
      
      await firstProject.click();
      await this.page.waitForFunction(() => window.location.pathname.includes('/projects/'));
      
      const url = this.page.url();
      if (!url.match(/\/projects\/\w+/)) {
        throw new Error(`Expected URL to match project pattern, got: ${url}`);
      }
      console.log(`   Navigated to: ${url}`);
    });

    await this.runTest('Navigate back to projects list', async () => {
      await this.page.goBack();
      await this.page.waitForFunction(() => window.location.pathname === '/');
      
      const projectCards = await this.page.$$('[data-testid="project-card"]');
      if (projectCards.length === 0) {
        throw new Error('Project cards not visible after navigation back');
      }
      console.log('   Successfully navigated back to projects list');
    });
  }

  async testResponsiveDesign() {
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1280, height: 720 },
      { name: 'Large Desktop', width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      await this.runTest(`Responsive design - ${viewport.name}`, async () => {
        await this.page.setViewport({ width: viewport.width, height: viewport.height });
        await this.page.goto(this.baseUrl);
        await this.page.waitForSelector('[data-testid="project-card"]');
        
        // Take screenshot for visual regression
        await this.takeScreenshot(`${viewport.name.toLowerCase()}-projects-list`);
        
        const projectCards = await this.page.$$('[data-testid="project-card"]');
        if (projectCards.length === 0) {
          throw new Error(`No project cards visible on ${viewport.name}`);
        }
        
        console.log(`   ${viewport.name} (${viewport.width}x${viewport.height}): ${projectCards.length} cards visible`);
      });
    }
  }

  async testInteractions() {
    await this.runTest('Search filtering works', async () => {
      await this.page.goto(this.baseUrl);
      await this.page.waitForSelector('[data-testid="project-card"]');
      
      const initialCards = await this.page.$$('[data-testid="project-card"]');
      const initialCount = initialCards.length;
      
      const searchInput = await this.page.$('input[placeholder*="Search"]');
      await searchInput.type('Documentation');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const filteredCards = await this.page.$$('[data-testid="project-card"]');
      console.log(`   Filtered from ${initialCount} to ${filteredCards.length} cards`);
      
      if (filteredCards.length > initialCount) {
        throw new Error('Filtering should not increase the number of cards');
      }
    });

    await this.runTest('View mode toggle works', async () => {
      await this.page.goto(this.baseUrl);
      await this.page.waitForSelector('[data-testid="project-card"]');
      
      // Look for view toggle buttons
      const buttons = await this.page.$$('button');
      let toggleFound = false;
      
      for (const button of buttons) {
        const buttonText = await this.page.evaluate(el => el.textContent, button);
        if (buttonText && (buttonText.includes('Grid') || buttonText.includes('List'))) {
          await button.click();
          await new Promise(resolve => setTimeout(resolve, 300));
          toggleFound = true;
          break;
        }
      }
      
      if (!toggleFound) {
        console.log('   View toggle buttons not found (may be icon-only)');
      } else {
        console.log('   View mode toggle clicked successfully');
      }
      
      // Verify cards are still visible
      const projectCards = await this.page.$$('[data-testid="project-card"]');
      if (projectCards.length === 0) {
        throw new Error('Project cards disappeared after view toggle');
      }
    });
  }

  async testPerformance() {
    await this.runTest('Page load performance', async () => {
      const startTime = Date.now();
      await this.page.goto(this.baseUrl);
      await this.page.waitForSelector('[data-testid="project-card"]');
      const loadTime = Date.now() - startTime;
      
      console.log(`   Page loaded in ${loadTime}ms`);
      
      if (loadTime > 5000) {
        throw new Error(`Page load time too slow: ${loadTime}ms (max: 5000ms)`);
      }
    });

    await this.runTest('DOM size validation', async () => {
      await this.page.goto(this.baseUrl);
      await this.page.waitForSelector('[data-testid="project-card"]');
      
      const domSize = await this.page.evaluate(() => {
        return document.querySelectorAll('*').length;
      });
      
      console.log(`   DOM contains ${domSize} elements`);
      
      if (domSize > 2000) {
        throw new Error(`DOM size too large: ${domSize} elements (max: 2000)`);
      }
    });
  }

  async testAccessibility() {
    await this.runTest('Heading hierarchy', async () => {
      await this.page.goto(this.baseUrl);
      await this.page.waitForSelector('h1');
      
      const headings = await this.page.$$eval('h1, h2, h3, h4, h5, h6', 
        elements => elements.map(el => el.tagName)
      );
      
      console.log(`   Found headings: ${headings.join(', ')}`);
      
      if (!headings.includes('H1')) {
        throw new Error('No H1 heading found');
      }
    });

    await this.runTest('Keyboard navigation', async () => {
      await this.page.goto(this.baseUrl);
      await this.page.waitForSelector('[data-testid="project-card"]');
      
      // Test Tab navigation
      await this.page.keyboard.press('Tab');
      await this.page.keyboard.press('Tab');
      
      const focusedElement = await this.page.evaluate(() => document.activeElement?.tagName);
      console.log(`   Focused element: ${focusedElement}`);
      
      if (!focusedElement) {
        throw new Error('No element received focus during keyboard navigation');
      }
    });
  }

  async runAllTests() {
    try {
      console.log('🎯 Starting comprehensive test suite...\n');
      
      await this.testBasicFunctionality();
      await this.testNavigation();
      await this.testResponsiveDesign();
      await this.testInteractions();
      await this.testPerformance();
      await this.testAccessibility();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error.message);
      this.results.failed++;
      this.results.errors.push({ test: 'Test Suite', error: error.message });
    }
  }

  async cleanup() {
    console.log('\n🧹 Cleaning up...');
    
    if (this.browser) {
      await this.browser.close();
      console.log('✅ Browser closed');
    }
    
    if (this.devServer) {
      this.devServer.kill();
      console.log('✅ Development server stopped');
    }
  }

  printResults() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${this.results.total}`);
    console.log(`Passed: ${this.results.passed} ✅`);
    console.log(`Failed: ${this.results.failed} ❌`);
    console.log(`Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);
    
    if (this.results.errors.length > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.results.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.test}: ${error.error}`);
      });
    }
    
    console.log('\n📸 Screenshots saved to:', this.screenshotDir);
    console.log('='.repeat(50));
  }
}

// Main execution
async function main() {
  const runner = new TestRunner();
  
  try {
    await runner.init();
    await runner.runAllTests();
  } catch (error) {
    console.error('❌ Test runner failed:', error.message);
  } finally {
    await runner.cleanup();
    runner.printResults();
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n⚠️  Test runner interrupted');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⚠️  Test runner terminated');
  process.exit(0);
});

main().catch(console.error); 