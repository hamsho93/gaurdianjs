const express = require('express');
const { GuardianJS } = require('../dist/index');

// Since the client module might not be built yet, let's use direct integration only
const directApp = express();
const guardian = new GuardianJS({
  useBehavior: true,
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
});

// Add middleware
directApp.use(async (req, res, next) => {
  try {
    const result = await guardian.isBot({
      userAgent: req.headers['user-agent'] || '',
      ip: req.ip || '',
      req
    });
    
    req.botDetection = result;
    next();
  } catch (error) {
    console.error('GuardianJS error:', error);
    next();
  }
});

directApp.get('/', (req, res) => {
  res.json({
    message: 'Direct Integration Test',
    botDetection: req.botDetection
  });
});

// Start test server
const DIRECT_PORT = 3001;

const directServer = directApp.listen(DIRECT_PORT, () => {
  console.log(`Direct integration test server running on port ${DIRECT_PORT}`);
});

// Add shutdown handler
process.on('SIGINT', () => {
  console.log('Shutting down test server...');
  directServer.close();
  process.exit(0);
});
