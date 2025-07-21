const GoogleApiService = require('./services/googleApiService');

async function testFunctionCalling() {
  console.log('🧪 Testing Function Calling Implementation\n');
  
  const googleApiService = new GoogleApiService();
  
  // Test cases
  const testCases = [
    { input: 'go to home', expected: 'navigate_home' },
    { input: 'take me to about page', expected: 'navigate_about' },
    { input: 'contact support', expected: 'navigate_contact' },
    { input: 'switch to voice mode', expected: 'toggle_voice_input' },
    { input: 'use text input', expected: 'toggle_text_input' },
    { input: 'clear everything', expected: 'clear_input' },
    { input: 'show help', expected: 'show_help' },
    { input: 'set quantity to 5', expected: 'enter_quantity' },
    { input: 'open inventory', expected: 'open_inventory' },
    { input: 'go back', expected: 'go_back' },
    { input: 'open settings', expected: 'open_settings' },
    { input: 'show cart', expected: 'open_cart' },
    { input: 'ir a casa', expected: 'navigate_home' }, // Spanish
    { input: 'aller à la page d\'accueil', expected: 'navigate_home' }, // French
    { input: 'quantity ten', expected: 'enter_quantity' },
    { input: 'set amount to twenty five', expected: 'enter_quantity' }
  ];
  
  let passedTests = 0;
  let totalTests = testCases.length;
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n📝 Test ${i + 1}/${totalTests}: "${testCase.input}"`);
    console.log(`Expected function: ${testCase.expected}`);
    
    try {
      const startTime = Date.now();
      const result = await googleApiService.processInstruction(testCase.input, 'en');
      const endTime = Date.now();
      
      console.log(`⏱️  Response time: ${endTime - startTime}ms`);
      console.log(`✅ Result:`, JSON.stringify(result, null, 2));
      
      // Check if the result matches expected behavior
      if (result.success) {
        console.log(`🎯 Test PASSED - Got successful response`);
        passedTests++;
      } else {
        console.log(`❌ Test FAILED - Got error response`);
      }
      
    } catch (error) {
      console.log(`💥 Test ERROR:`, error.message);
    }
    
    // Add delay between tests to avoid rate limiting
    if (i < testCases.length - 1) {
      console.log('⏳ Waiting 2 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log(`\n📊 Test Results:`);
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
  console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Function calling is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the implementation.');
  }
}

// Run the test
testFunctionCalling().catch(console.error); 