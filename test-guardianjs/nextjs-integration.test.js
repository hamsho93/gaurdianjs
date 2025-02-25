// test-guardianjs/nextjs-integration.test.js
const { withGuardian } = require('../dist/integrations/nextjs');

describe('Next.js Integration', () => {
  test('withGuardian should wrap handler and add bot detection', async () => {
    // Mock Next.js request and response
    const req = {
      headers: {
        'user-agent': 'Mozilla/5.0 Test Browser'
      },
      socket: {
        remoteAddress: '127.0.0.1'
      }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Create a mock handler
    const mockHandler = jest.fn((req, res) => {
      res.status(200).json({ 
        message: 'Next.js Integration Test',
        botDetection: req.botDetection
      });
    });
    
    // Wrap the handler with our middleware
    const wrappedHandler = withGuardian(mockHandler, {
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
    
    // Call the wrapped handler
    await wrappedHandler(req, res);
    
    // Verify the handler was called
    expect(mockHandler).toHaveBeenCalled();
    
    // Verify bot detection was added to the request
    expect(req.botDetection).toBeDefined();
    expect(req.botDetection.isBot).toBe(false);
    
    // Verify the response was sent
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
  
  test('withGuardian should detect bots correctly', async () => {
    // Mock Next.js request with bot user agent
    const req = {
      headers: {
        'user-agent': 'TestBot/1.0'
      },
      socket: {
        remoteAddress: '127.0.0.1'
      }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Create a mock handler
    const mockHandler = jest.fn((req, res) => {
      res.status(200).json({ 
        message: 'Next.js Integration Test',
        botDetection: req.botDetection
      });
    });
    
    // Wrap the handler with our middleware
    const wrappedHandler = withGuardian(mockHandler, {
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
    
    // Call the wrapped handler
    await wrappedHandler(req, res);
    
    // Verify bot detection was added to the request
    expect(req.botDetection).toBeDefined();
    expect(req.botDetection.isBot).toBe(true);
    expect(req.botDetection.reasons).toContain('Test Bot Detection');
  });
});