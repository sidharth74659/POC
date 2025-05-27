#!/usr/bin/env node

const { spawn } = require('child_process');
const puppeteer = require('puppeteer');

let devServer;
let browser;

async function waitForServer(url, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return true;
      }
    } catch (error) {
      // Server not ready yet
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  throw new Error(`Server did not start within ${timeout}ms`);
}

async function runTests() {
  console.log('🚀 Starting DocuTrack E2E Test Suite...\n');

  try {
    // Start the development server
    console.log('📦 Starting Vite dev server...');
    devServer = spawn('npm', ['run', 'dev'], {
      stdio: 'pipe',
      shell: true
    });

    devServer.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Local:')) {
        console.log('✅ Dev server started successfully');
      }
    });

    devServer.stderr.on('data', (data) => {
      console.error('Dev server error:', data.toString());
    });

    // Wait for server to be ready
    await waitForServer('http://localhost:5173');
    console.log('🌐 Server is ready at http://localhost:5173\n');

    // Launch browser
    console.log('🌐 Launching browser...');
    browser = await puppeteer.launch({
      headless: false, // Set to true for CI
      slowMo: 100,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    // Set up console logging
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error('❌ Browser console error:', msg.text());
      }
    });

    page.on('pageerror', (error) => {
      console.error('❌ Page error:', error.message);
    });

    console.log('✅ Browser launched successfully\n');

    // Run basic tests
    await runBasicTests(page);
    await runNavigationTests(page);
    await runInteractionTests(page);
    await runResponsiveTests(page);

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
    process.exit(1);
  } finally {
    // Cleanup
    if (browser) {
      await browser.close();
      console.log('🔒 Browser closed');
    }
    if (devServer) {
      devServer.kill();
      console.log('🛑 Dev server stopped');
    }
  }
}

async function runBasicTests(page) {
  console.log('🧪 Running basic functionality tests...');

  // Test 1: Projects list loads
  await page.goto('http://localhost:5173');
  await page.waitForSelector('h1', { timeout: 10000 });
  
  const title = await page.$eval('h1', el => el.textContent);
  if (title !== 'Projects') {
    throw new Error('Projects page title is incorrect');
  }
  console.log('  ✅ Projects list page loads correctly');

  // Test 2: Project cards are visible
  const projectCards = await page.$$('[data-testid="project-card"]');
  if (projectCards.length === 0) {
    throw new Error('No project cards found');
  }
  console.log(`  ✅ Found ${projectCards.length} project cards`);

  // Take screenshot
  await page.screenshot({ 
    path: 'tests/screenshots/projects-list-manual.png',
    fullPage: true 
  });
  console.log('  📸 Screenshot saved: projects-list-manual.png');
}

async function runNavigationTests(page) {
  console.log('\n🧭 Running navigation tests...');

  // Test 1: Navigate to project detail
  await page.click('[data-testid="project-card"]:first-child');
  await page.waitForNavigation();
  
  if (!page.url().includes('/projects/')) {
    throw new Error('Navigation to project detail failed');
  }
  console.log('  ✅ Navigation to project detail works');

  // Test 2: Tiles are visible
  await page.waitForSelector('[data-testid="tile-list"]');
  const tiles = await page.$$('[data-testid="tile-item"]');
  if (tiles.length === 0) {
    throw new Error('No tiles found');
  }
  console.log(`  ✅ Found ${tiles.length} tiles`);

  // Test 3: Select a tile
  await page.click('[data-testid="tile-item"]:first-child');
  await page.waitForSelector('[data-testid="tile-content"]');
  console.log('  ✅ Tile selection works');

  // Take screenshot
  await page.screenshot({ 
    path: 'tests/screenshots/project-detail-manual.png',
    fullPage: true 
  });
  console.log('  📸 Screenshot saved: project-detail-manual.png');
}

async function runInteractionTests(page) {
  console.log('\n🎯 Running interaction tests...');

  // Test 1: Open create issue modal
  await page.click('[data-testid="create-issue-btn"]');
  await page.waitForSelector('[data-testid="create-issue-modal"]');
  console.log('  ✅ Create issue modal opens');

  // Test 2: Fill form and create issue
  await page.type('[data-testid="issue-title"]', 'Test Issue from Automation');
  await page.select('[data-testid="issue-assignee"]', 'Developer');
  await page.select('[data-testid="issue-priority"]', 'High');
  
  // Modify content
  await page.evaluate(() => {
    const textarea = document.querySelector('[data-testid="issue-content"]');
    if (textarea) {
      textarea.value = textarea.value + '\n\n++This is an automated test addition++';
    }
  });

  // Take screenshot of modal
  await page.screenshot({ 
    path: 'tests/screenshots/create-issue-modal-manual.png' 
  });
  console.log('  📸 Screenshot saved: create-issue-modal-manual.png');

  // Submit form
  await page.click('[data-testid="submit-issue"]');
  await page.waitForSelector('[data-testid="create-issue-modal"]', { hidden: true });
  console.log('  ✅ Issue created successfully');

  // Test 3: Navigate to issue detail
  await page.waitForSelector('[data-testid="issues-table"] tbody tr');
  await page.click('[data-testid="issues-table"] tbody tr:first-child');
  await page.waitForNavigation();
  
  if (!page.url().includes('/issues/')) {
    throw new Error('Navigation to issue detail failed');
  }
  console.log('  ✅ Navigation to issue detail works');

  // Take screenshot of issue detail
  await page.screenshot({ 
    path: 'tests/screenshots/issue-detail-manual.png',
    fullPage: true 
  });
  console.log('  📸 Screenshot saved: issue-detail-manual.png');
}

async function runResponsiveTests(page) {
  console.log('\n📱 Running responsive design tests...');

  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 720 },
  ];

  for (const viewport of viewports) {
    await page.setViewport(viewport);
    await page.goto('http://localhost:5173');
    await page.waitForSelector('h1');
    
    await page.screenshot({ 
      path: `tests/screenshots/responsive-${viewport.name}-manual.png`,
      fullPage: true 
    });
    console.log(`  📸 Screenshot saved: responsive-${viewport.name}-manual.png`);
  }
  
  console.log('  ✅ Responsive design tests completed');
}

// Run the test suite
runTests(); 