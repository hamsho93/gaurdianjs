// test-guardianjs/run-tests.js
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure the dist directory exists before running tests
if (!fs.existsSync(path.join(__dirname, '..', 'dist'))) {
  console.error('❌ Error: dist directory not found. Please build the project first with "npm run build"');
  process.exit(1);
}

console.log('🧪 Running GuardianJS integration tests...\n');

// Function to run a command and return a promise
function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    console.log(`📋 Running: ${command} ${args.join(' ')}`);
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

async function runTests() {
  try {
    // Run Jest tests for Express integration
    await runCommand('npx', ['jest', 'express-integration.test.js']);
    
    // Run Jest tests for Next.js integration
    await runCommand('npx', ['jest', 'nextjs-integration.test.js']);
    
    // Run Jest tests for CLI setup
    await runCommand('npx', ['jest', 'cli-setup.test.js']);
    
    // Run the manual integration test if it exists
    if (require('fs').existsSync(path.join(__dirname, 'test.js'))) {
      await runCommand('node', ['test.js']);
    }
    
    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.error('\n❌ Tests failed:', error.message);
    process.exit(1);
  }
}

runTests();