// test-guardianjs/test.js
const fetch = require('node-fetch');
const express = require('express');
const { GuardianJS } = require('../dist/index');
const { createGuardianMiddleware } = require('../dist/integrations/express');

// Create an Express app with the new simplified middleware
const app = express();
app.use(createGuardianMiddleware({
  threshold: 0.5,
  customRules: [
    {
      name: 'Test Bot Detection',
      test: (params) => {
        return params.userAgent.toLowerCase().includes('testbot');
      },
      score: 1.0
    }
  ]
}));

app.get('/', (req, res) => {
  res.json({
    message: 'Simplified Integration Test',
    botDetection: req.botDetection
  });
});

// Start the server
const server = app.listen(3002, () => {
  console.log('Test server running on port 3002');
});

// Ensure server closes on process exit
process.on('exit', () => {
  server.close();
});

process.on('SIGINT', () => {
  server.close();
  process.exit(0);
});

async function runTests() {
  console.log('Running GuardianJS integration tests...');
  
  let allTestsPassed = true;
  
  // Test new simplified integration
  try {
    const simplifiedNormalResponse = await fetch('http://localhost:3002/', {
      headers: { 'User-Agent': 'Mozilla/5.0 Test Browser' }
    });
    const simplifiedNormalData = await simplifiedNormalResponse.json();
    const normalPassed = simplifiedNormalData.botDetection.isBot === false;
    console.log('Simplified integration (normal user):', 
      normalPassed ? '✅ PASS' : '❌ FAIL');
    if (!normalPassed) allTestsPassed = false;
  } catch (error) {
    console.error('Simplified integration test failed:', error);
    allTestsPassed = false;
  }
  
  try {
    const simplifiedBotResponse = await fetch('http://localhost:3002/', {
      headers: { 'User-Agent': 'TestBot/1.0' }
    });
    const simplifiedBotData = await simplifiedBotResponse.json();
    const botPassed = simplifiedBotData.botDetection.isBot === true;
    console.log('Simplified integration (bot detection):', 
      botPassed ? '✅ PASS' : '❌ FAIL');
    if (!botPassed) allTestsPassed = false;
  } catch (error) {
    console.error('Simplified bot test failed:', error);
    allTestsPassed = false;
  }
  
  console.log('Tests completed!');
  server.close();
  
  // Exit with appropriate code
  process.exit(allTestsPassed ? 0 : 1);
}

// Run the tests
runTests();