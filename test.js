const GuardianTracker = require('bot-guardian-js');

// Create tracker without starting server
const tracker = new GuardianTracker({
  endpoint: 'https://test.com',
  startServer: false  // explicitly disable server start
});

console.log('Created tracker:', tracker);
console.log('Endpoint:', tracker.getEndpoint()); 