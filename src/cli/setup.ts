// src/cli/setup.ts
import fs from 'fs';
import path from 'path';

function detectFramework() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    
    if (packageJson.dependencies?.next) return 'nextjs';
    if (packageJson.dependencies?.express) return 'express';
    if (packageJson.dependencies?.react && !packageJson.dependencies?.next) return 'react';
    
    return 'unknown';
  } catch (error) {
    return 'unknown';
  }
}

function setupNextJs() {
  // Create middleware file
  const middlewareDir = './lib';
  if (!fs.existsSync(middlewareDir)) {
    fs.mkdirSync(middlewareDir, { recursive: true });
  }
  
  const middlewareContent = `
import { withGuardian } from 'bot-guardian-js/nextjs';

export default withGuardian;
`;
  
  fs.writeFileSync(path.join(middlewareDir, 'guardian.js'), middlewareContent);
  
  // Create example API route
  const apiDir = './pages/api';
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
  }
  
  const apiRouteContent = `
import withGuardian from '../../lib/guardian';

function handler(req, res) {
  // Access bot detection results
  const botDetection = req.botDetection;
  
  res.status(200).json({ 
    message: botDetection.isBot ? 'Hello Bot!' : 'Hello Human!',
    botDetection
  });
}

export default withGuardian(handler);
`;
  
  fs.writeFileSync(path.join(apiDir, 'guardian-test.js'), apiRouteContent);
  
  console.log('✅ Next.js integration set up successfully!');
  console.log('📝 Added middleware at: lib/guardian.js');
  console.log('📝 Added example API route at: pages/api/guardian-test.js');
}

function setupExpress() {
  const appFile = './app.js';
  
  if (!fs.existsSync(appFile)) {
    const expressAppContent = `
const express = require('express');
const { createGuardianMiddleware } = require('bot-guardian-js/express');

const app = express();
const port = process.env.PORT || 3000;

// Add GuardianJS middleware
app.use(createGuardianMiddleware());

app.get('/', (req, res) => {
  res.json({
    message: req.botDetection.isBot ? 'Hello Bot!' : 'Hello Human!',
    botDetection: req.botDetection
  });
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});
`;
    
    fs.writeFileSync(appFile, expressAppContent);
    console.log('✅ Express integration set up successfully!');
    console.log('📝 Created new Express app with GuardianJS at: app.js');
  } else {
    console.log('⚠️ Existing app.js found. Please manually add the middleware:');
    console.log(`
const { createGuardianMiddleware } = require('bot-guardian-js/express');
app.use(createGuardianMiddleware());
`);
  }
}

function setupReact() {
  // Create provider component
  const componentsDir = './src/components';
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }
  
  const providerContent = `
import { GuardianProvider } from 'bot-guardian-js/react';

export default function AppWrapper({ children }) {
  return (
    <GuardianProvider>
      {children}
    </GuardianProvider>
  );
}
`;
  
  fs.writeFileSync(path.join(componentsDir, 'GuardianWrapper.jsx'), providerContent);
  
  console.log('✅ React integration set up successfully!');
  console.log('📝 Added provider component at: src/components/GuardianWrapper.jsx');
  console.log('⚠️ Please wrap your app with this component in your main index.js or App.js file.');
}

export function setupGuardian() {
  const framework = detectFramework();
  
  console.log(`🔍 Detected framework: ${framework}`);
  
  switch (framework) {
    case 'nextjs':
      setupNextJs();
      break;
    case 'express':
      setupExpress();
      break;
    case 'react':
      setupReact();
      break;
    default:
      console.log('⚠️ Could not detect framework. Please check documentation for manual setup.');
  }
}