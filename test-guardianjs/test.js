// test-guardianjs/test.js
const fetch = require('node-fetch');

async function runTests() {
  console.log('Running GuardianJS integration tests...');
  
  // Test direct integration with normal user agent
  try {
    const directNormalResponse = await fetch('http://localhost:3001/', {
      headers: { 'User-Agent': 'Mozilla/5.0 Test Browser' }
    });
    const directNormalData = await directNormalResponse.json();
    console.log('Direct integration (normal user):', 
      directNormalData.botDetection.isBot === false ? '✅ PASS' : '❌ FAIL');
  } catch (error) {
    console.error('Direct integration test failed:', error);
  }
  
  // Test direct integration with bot user agent
  try {
    const directBotResponse = await fetch('http://localhost:3001/', {
      headers: { 'User-Agent': 'TestBot/1.0' }
    });
    const directBotData = await directBotResponse.json();
    console.log('Direct integration (bot detection):', 
      directBotData.botDetection.isBot === true ? '✅ PASS' : '❌ FAIL');
  } catch (error) {
    console.error('Direct bot test failed:', error);
  }
  
  console.log('Tests completed!');
}

// Wait for servers to start
setTimeout(runTests, 1000);