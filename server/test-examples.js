/**
 * Test examples for the Voice AI Instruction Mapping Server
 * This file demonstrates various test cases and edge cases
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

// Test cases with various inputs and languages
const testCases = [
  // English tests
  {
    name: 'Basic Navigation - Home',
    input: 'go to home',
    language: 'en',
    expectedAction: 'navigate'
  },
  {
    name: 'Basic Navigation - About',
    input: 'show about page',
    language: 'en',
    expectedAction: 'navigate'
  },
  {
    name: 'Voice Input Toggle',
    input: 'switch to voice mode',
    language: 'en',
    expectedAction: 'toggle_input'
  },
  {
    name: 'Text Input Toggle',
    input: 'use text input',
    language: 'en',
    expectedAction: 'toggle_input'
  },
  {
    name: 'Clear Input',
    input: 'clear everything',
    language: 'en',
    expectedAction: 'clear_input'
  },
  {
    name: 'Show Help',
    input: 'what can you do',
    language: 'en',
    expectedAction: 'show_help'
  },
  {
    name: 'Enter Quantity',
    input: 'set quantity to 25',
    language: 'en',
    expectedAction: 'enter_quantity'
  },
  {
    name: 'Open Inventory',
    input: 'show inventory',
    language: 'en',
    expectedAction: 'open_inventory'
  },
  {
    name: 'Go Back',
    input: 'go back',
    language: 'en',
    expectedAction: 'go_back'
  },
  {
    name: 'Open Settings',
    input: 'open settings',
    language: 'en',
    expectedAction: 'open_settings'
  },
  {
    name: 'Open Cart',
    input: 'show shopping cart',
    language: 'en',
    expectedAction: 'open_cart'
  },

  // Spanish tests
  {
    name: 'Spanish - Home',
    input: 'ir a casa',
    language: 'es',
    expectedAction: 'navigate'
  },
  {
    name: 'Spanish - About',
    input: 'mostrar página de información',
    language: 'es',
    expectedAction: 'navigate'
  },
  {
    name: 'Spanish - Voice Input',
    input: 'cambiar a modo voz',
    language: 'es',
    expectedAction: 'toggle_input'
  },
  {
    name: 'Spanish - Quantity',
    input: 'establecer cantidad a veinticinco',
    language: 'es',
    expectedAction: 'enter_quantity'
  },

  // French tests
  {
    name: 'French - Home',
    input: 'aller à l\'accueil',
    language: 'fr',
    expectedAction: 'navigate'
  },
  {
    name: 'French - Help',
    input: 'afficher l\'aide',
    language: 'fr',
    expectedAction: 'show_help'
  },

  // German tests
  {
    name: 'German - Settings',
    input: 'einstellungen öffnen',
    language: 'de',
    expectedAction: 'open_settings'
  },
  {
    name: 'German - Cart',
    input: 'warenkorb anzeigen',
    language: 'de',
    expectedAction: 'open_cart'
  },

  // Edge cases
  {
    name: 'Numeric Input - Written',
    input: 'enter quantity as twenty five',
    language: 'en',
    expectedAction: 'enter_quantity'
  },
  {
    name: 'Numeric Input - Spoken',
    input: 'set quantity to ten',
    language: 'en',
    expectedAction: 'enter_quantity'
  },
  {
    name: 'Synonyms - Cart',
    input: 'show basket',
    language: 'en',
    expectedAction: 'open_cart'
  },
  {
    name: 'Synonyms - Inventory',
    input: 'display products',
    language: 'en',
    expectedAction: 'open_inventory'
  },
  {
    name: 'Multi-action Phrase',
    input: 'open settings and enable notifications',
    language: 'en',
    expectedAction: 'open_settings'
  },
  {
    name: 'Ambiguous Input',
    input: 'something random',
    language: 'en',
    expectedAction: 'show_error'
  }
];

/**
 * Run a single test case
 */
async function runTest(testCase) {
  try {
    console.log(`\n🧪 Testing: ${testCase.name}`);
    console.log(`📝 Input: "${testCase.input}" (${testCase.language})`);
    
    const response = await axios.post(`${BASE_URL}/process-instruction`, {
      text: testCase.input,
      language: testCase.language
    });
    
    const result = response.data;
    
    console.log(`✅ Response: ${result.data.instruction}`);
    console.log(`🎯 Action: ${result.data.action}`);
    console.log(`📊 Success: ${result.data.success}`);
    
    if (result.data.parameters && Object.keys(result.data.parameters).length > 0) {
      console.log(`📋 Parameters:`, result.data.parameters);
    }
    
    return result.data.action === testCase.expectedAction;
    
  } catch (error) {
    console.error(`❌ Test failed: ${testCase.name}`);
    console.error(`Error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

/**
 * Run all test cases
 */
async function runAllTests() {
  console.log('🚀 Starting Voice AI Server Tests');
  console.log('=' .repeat(50));
  
  let passed = 0;
  let failed = 0;
  
  for (const testCase of testCases) {
    const success = await runTest(testCase);
    if (success) {
      passed++;
    } else {
      failed++;
    }
    
    // Add delay between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
}

/**
 * Test server health
 */
async function testHealth() {
  try {
    console.log('🏥 Testing server health...');
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is healthy:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Server health check failed:', error.message);
    return false;
  }
}

/**
 * Test available instructions endpoint
 */
async function testInstructions() {
  try {
    console.log('📋 Testing instructions endpoint...');
    const response = await axios.get(`${BASE_URL}/instructions`);
    console.log('✅ Available instructions:', response.data.data.length);
    return true;
  } catch (error) {
    console.error('❌ Instructions endpoint failed:', error.message);
    return false;
  }
}

/**
 * Main test runner
 */
async function main() {
  console.log('🎯 Voice AI Server Test Suite');
  console.log('=' .repeat(50));
  
  // Test server health first
  const isHealthy = await testHealth();
  if (!isHealthy) {
    console.error('❌ Server is not healthy. Please start the server first.');
    return;
  }
  
  // Test instructions endpoint
  await testInstructions();
  
  // Run all test cases
  await runAllTests();
}

// Run tests if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testCases,
  runTest,
  runAllTests,
  testHealth,
  testInstructions
}; 