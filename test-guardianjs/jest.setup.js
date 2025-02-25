// test-guardianjs/jest.setup.js
// Mock the GuardianJS class for tests if needed
jest.mock('../dist/core/GuardianJS', () => {
  return {
    GuardianJS: class MockGuardianJS {
      constructor(config) {
        this.config = config || {};
      }
      
      isBot(params) {
        // Simple bot detection logic for testing
        const ua = (params.userAgent || '').toLowerCase();
        const isBot = ua.includes('bot') || ua.includes('testbot');
        
        return Promise.resolve({
          isBot,
          confidence: isBot ? 1 : 0,
          score: isBot ? 1 : 0,
          reasons: isBot ? ['Test Bot Detection'] : [],
          behavior: {}
        });
      }
    }
  };
}, { virtual: true });

// Silence console logs during tests to reduce noise
const originalConsoleError = console.error;
console.error = (...args) => {
  // Filter out specific error messages we expect during tests
  if (args[0] === 'GuardianJS error:') {
    return;
  }
  originalConsoleError(...args);
};

// Add global test utilities if needed
global.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));