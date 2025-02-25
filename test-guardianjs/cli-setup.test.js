// test-guardianjs/cli-setup.test.js
const fs = require('fs');
const path = require('path');
const { setupGuardian } = require('../dist/cli/setup');

describe('CLI Setup', () => {
  // Create a temporary directory for testing
  const testDir = path.join(__dirname, 'temp-test-dir');
  
  beforeEach(() => {
    // Create test directory
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
    }
    
    // Change to test directory
    process.chdir(testDir);
  });
  
  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    
    // Change back to original directory
    process.chdir(__dirname);
  });
  
  test('Should detect Express framework and create setup files', () => {
    // Create a mock package.json with Express
    fs.writeFileSync(
      path.join(testDir, 'package.json'),
      JSON.stringify({
        name: 'test-app',
        dependencies: {
          express: '^4.17.1'
        }
      })
    );
    
    // Run the setup
    setupGuardian();
    
    // Check if app.js was created
    expect(fs.existsSync(path.join(testDir, 'app.js'))).toBe(true);
    
    // Check content of app.js
    const appContent = fs.readFileSync(path.join(testDir, 'app.js'), 'utf8');
    expect(appContent).toContain('createGuardianMiddleware');
  });
  
  test('Should detect Next.js framework and create setup files', () => {
    // Create a mock package.json with Next.js
    fs.writeFileSync(
      path.join(testDir, 'package.json'),
      JSON.stringify({
        name: 'test-app',
        dependencies: {
          next: '^12.0.0',
          react: '^17.0.2'
        }
      })
    );
    
    // Create pages/api directory
    const apiDir = path.join(testDir, 'pages', 'api');
    fs.mkdirSync(apiDir, { recursive: true });
    
    // Run the setup
    setupGuardian();
    
    // Check if guardian.js was created
    expect(fs.existsSync(path.join(testDir, 'lib', 'guardian.js'))).toBe(true);
    
    // Check if example API route was created
    expect(fs.existsSync(path.join(testDir, 'pages', 'api', 'guardian-test.js'))).toBe(true);
  });
});