// test-guardianjs/express-integration.test.js
const express = require('express');
const request = require('supertest');
const { createGuardianMiddleware } = require('../dist/integrations/express');

describe('Express Integration', () => {
  let app;
  
  beforeEach(() => {
    // Create a fresh Express app for each test
    app = express();
    
    // Add the simplified middleware
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
    
    // Add a test route
    app.get('/', (req, res) => {
      res.json({
        message: 'Express Integration Test',
        botDetection: req.botDetection
      });
    });
  });
  
  test('Should detect normal user agent correctly', async () => {
    const response = await request(app)
      .get('/')
      .set('User-Agent', 'Mozilla/5.0 Test Browser');
    
    expect(response.status).toBe(200);
    expect(response.body.botDetection).toBeDefined();
    expect(response.body.botDetection.isBot).toBe(false);
  });
  
  test('Should detect bot user agent correctly', async () => {
    const response = await request(app)
      .get('/')
      .set('User-Agent', 'TestBot/1.0');
    
    expect(response.status).toBe(200);
    expect(response.body.botDetection).toBeDefined();
    expect(response.body.botDetection.isBot).toBe(true);
    expect(response.body.botDetection.reasons).toContain('Test Bot Detection');
  });
});