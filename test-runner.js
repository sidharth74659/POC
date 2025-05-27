#!/usr/bin/env node

import { spawn } from 'child_process';
import puppeteer from 'puppeteer';

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
    await runPerformanceTests(page); // New performance tests

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
  const projectCards = await page.$$('div.cursor-pointer');
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
  await page.click('div.cursor-pointer:first-child');
  await page.waitForNavigation();
  
  if (!page.url().includes('/projects/')) {
    throw new Error('Navigation to project detail failed');
  }
  console.log('  ✅ Navigation to project detail works');

  // Test 2: Tiles are visible
  await page.waitForSelector('.px-4.py-3.cursor-pointer');
  const tiles = await page.$$('.px-4.py-3.cursor-pointer');
  if (tiles.length === 0) {
    throw new Error('No tiles found');
  }
  console.log(`  ✅ Found ${tiles.length} tiles`);

  // Test 3: Select a tile
  await page.click('.px-4.py-3.cursor-pointer:first-child');
  await page.waitForSelector('h2:nth-of-type(2)');
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
  await page.click('button');
  await page.waitForSelector('[role="dialog"]');
  console.log('  ✅ Create issue modal opens');

  // Test 2: Fill form
  await page.type('input[placeholder="Enter issue title"]', 'Test Issue from Automation');
  
  // Modify content
  await page.evaluate(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.value = textarea.value + '\n\n++This is an automated test addition++';
    }
  });

  // Take screenshot of modal
  await page.screenshot({ 
    path: 'tests/screenshots/create-issue-modal-manual.png' 
  });
  console.log('  📸 Screenshot saved: create-issue-modal-manual.png');

  // Close modal
  await page.keyboard.press('Escape');
  console.log('  ✅ Modal interaction works');
}

async function runResponsiveTests(page) {
  console.log('\n📱 Running responsive design tests...');

  const viewports = [
    { width: 375, height: 667, name: 'Mobile' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 1280, height: 720, name: 'Desktop' },
    { width: 1920, height: 1080, name: 'Large Desktop' }
  ];

  for (const viewport of viewports) {
    await page.setViewport(viewport);
    await page.goto('http://localhost:5173');
    await page.waitForSelector('h1');
    
    await page.screenshot({ 
      path: `tests/screenshots/responsive-${viewport.name.toLowerCase()}.png`,
      fullPage: true 
    });
    console.log(`  ✅ ${viewport.name} (${viewport.width}x${viewport.height}) - Screenshot saved`);
  }

  // Reset to desktop
  await page.setViewport({ width: 1280, height: 720 });
}

async function runPerformanceTests(page) {
  console.log('\n⚡ Running performance tests...');

  // Test 1: Page load performance
  const startTime = Date.now();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  const loadTime = Date.now() - startTime;
  
  console.log(`  ⏱️ Page load time: ${loadTime}ms`);
  if (loadTime > 3000) {
    console.warn(`  ⚠️ Page load time is slow: ${loadTime}ms`);
  } else {
    console.log('  ✅ Page load time is acceptable');
  }

  // Test 2: Bundle size analysis
  const performanceEntries = await page.evaluate(() => {
    return performance.getEntriesByType('navigation').map(entry => ({
      loadEventEnd: entry.loadEventEnd,
      domContentLoadedEventEnd: entry.domContentLoadedEventEnd,
      transferSize: entry.transferSize
    }));
  });

  console.log(`  📦 DOM Content Loaded: ${performanceEntries[0]?.domContentLoadedEventEnd}ms`);
  console.log(`  📦 Load Event End: ${performanceEntries[0]?.loadEventEnd}ms`);
  console.log(`  📦 Transfer Size: ${performanceEntries[0]?.transferSize} bytes`);

  // Test 3: Memory usage
  const metrics = await page.metrics();
  console.log(`  🧠 JS Heap Used: ${(metrics.JSHeapUsedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  🧠 JS Heap Total: ${(metrics.JSHeapTotalSize / 1024 / 1024).toFixed(2)} MB`);
  
  if (metrics.JSHeapUsedSize > 50 * 1024 * 1024) { // 50MB
    console.warn('  ⚠️ High memory usage detected');
  } else {
    console.log('  ✅ Memory usage is acceptable');
  }
}

// Run the tests
runTests().catch(console.error); 