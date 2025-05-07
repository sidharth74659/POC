/**
 * Test script for the OpenAI tools integration
 * Run with: node test-tools.js "Your question here"
 */
const aiHelperService = require('./services/aiHelperService');
const toolsWrapper = require('./openai-tools/tools-wrapper');

const testQuery = process.argv[2] || "Which operations are assigned to resource res-002 next week?";

async function testDirectTools() {
  console.log('Testing OpenAI tools directly:');
  console.log('----------------------------');
  console.log('Query:', testQuery);
  console.log('----------------------------');
  
  try {
    const result = await toolsWrapper.processQuery(testQuery);
    console.log('Result:');
    console.log(result.answer);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function testAiHelperService() {
  console.log('\nTesting AI Helper Service:');
  console.log('----------------------------');
  console.log('Query:', testQuery);
  console.log('----------------------------');
  
  try {
    const result = await aiHelperService.processQuestion(testQuery, {
      useDirectToolCalls: true
    });
    console.log('Result:');
    console.log(result.answer);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run both tests
async function runTests() {
  await testDirectTools();
  await testAiHelperService();
  
  console.log('\nSample API request with curl:');
  console.log('----------------------------');
  console.log(`curl -X POST http://localhost:3000/ai/chat/direct \\
  -H "Content-Type: application/json" \\
  -d '{"question": "${testQuery.replace(/"/g, '\\"')}"}'`);
}

runTests();