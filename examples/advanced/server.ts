import express from 'express';
import { GuardianJS, GuardianConfig } from '../../dist';

const app = express();

// Advanced configuration
const config: GuardianConfig = {
  threshold: 0.7,
  enableBehaviorAnalysis: true,
  enableTLSFingerprinting: true,
  enableUserAgentAnalysis: true,
  timeoutMs: 5000,
  maxRequestsPerMinute: 100,
  whitelist: {
    ips: ['127.0.0.1'],
    userAgents: ['GoogleBot'],
    paths: ['/health', '/metrics']
  },
  blacklist: {
    ips: [],
    userAgents: ['BadBot'],
    patterns: [/malicious/i]
  },
  customRules: [
    {
      name: 'customHeader',
      condition: (req) => Boolean(req.headers['x-custom-header']),
      weight: 0.5
    }
  ]
};

const guardian = new GuardianJS(config);

// Add GuardianJS middleware
app.use(guardian.middleware());

// API routes
app.get('/', (req, res) => {
  res.send('Protected by GuardianJS - Advanced Example');
});

app.post('/api/data', (req, res) => {
  res.json({ status: 'success', message: 'Protected API endpoint' });
});

app.get('/metrics', (req, res) => {
  res.json(guardian.getMetrics());
});

app.listen(3001, () => {
  console.log('Advanced example running on http://localhost:3001');
}); 