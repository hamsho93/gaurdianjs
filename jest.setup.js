// jest.setup.js
// Mock the GuardianJS class for React tests
jest.mock('./src/core/GuardianJS', () => {
    return {
      GuardianJS: class MockGuardianJS {
        constructor() {
          this.events = [];
        }
        
        track(event) {
          this.events.push(event);
        }
        
        isBot() {
          return Promise.resolve({
            isBot: false,
            confidence: 0,
            score: 0,
            reasons: [],
            behavior: {}
          });
        }
      }
    };
  });

// Silence console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
}

// Mock fetch if needed
global.fetch = jest.fn(() => 
  Promise.resolve({
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    ok: true
  })
);