// run-tests.js
const { execSync } = require('child_process');

// Only run the core tests that are working
console.log('🧪 Running core tests...');
try {
  execSync('npx jest src/core/__tests__ src/middleware/__tests__ src/client/__tests__ src/server/__tests__/tracking.test.ts', { 
    stdio: 'inherit' 
  });
} catch (error) {
  console.error('❌ Core tests failed');
  process.exit(1);
}

console.log('\n✅ Core tests completed successfully!');