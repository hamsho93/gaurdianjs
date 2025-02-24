import express from 'express';
import { GuardianJS } from 'guardianjs';
import path from 'path';

interface BotDetectionParams {
  userAgent: string;
  ip: string;
  req?: any;
}

const app = express();

// Add logging middleware
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.path}`);
  console.log(`User-Agent: ${req.headers['user-agent']}`);
  next();
});

// Initialize GuardianJS with proper bot detection rules and logging
const guardian = new GuardianJS({
  useBehavior: true,
  threshold: 0.5, // Lower threshold for testing
  customRules: [
    {
      name: 'Known Bot Detection',
      test: (params: BotDetectionParams) => {
        const knownBots = [
          'googlebot',
          'bingbot',
          'yandexbot',
          'duckduckbot',
          'baiduspider',
          'facebookexternalhit'
        ];
        const ua = params.userAgent.toLowerCase();
        const isBot = knownBots.some(bot => ua.includes(bot));
        console.log('Bot detection result:', { userAgent: ua, isBot });
        return isBot;
      },
      score: 1.0
    }
  ]
});

// Add middleware to parse JSON bodies
app.use(express.json());

// Add GuardianJS middleware with logging
app.use(async (req, res, next) => {
  try {
    const result = await guardian.isBot({
      userAgent: req.headers['user-agent'] || '',
      ip: req.ip || '',
      req
    });
    
    console.log('GuardianJS detection result:', result);
    
    req.botDetection = {
      timestamp: new Date(),
      isBot: result.isBot,
      confidence: result.confidence,
      path: req.path,
      userAgent: req.headers['user-agent'] || 'Unknown',
      ip: req.ip || 'Unknown',
      reasons: result.reasons,
      behavior: result.behavior
    };
    
    next();
  } catch (error) {
    console.error('GuardianJS error:', error);
    next();
  }
});

// Update static file serving to point to guardianjs package dashboard
const dashboardPath = path.resolve(__dirname, '../../../src/dashboard');
app.use('/dashboard', express.static(dashboardPath));

// Add before your existing routes
app.get('/data', async (req, res) => {
  try {
    const data = {
      totalRequests: 100,
      detectedBots: 25,
      recentDetections: [{
        type: 'Browser',
        userAgent: req.headers['user-agent'],
        confidence: 0,
        timestamp: new Date(),
        behavior: {
          mouseMovements: 0,
          keystrokes: 0,
          timeOnPage: 0,
          scrolling: false
        },
        reasons: []
      }]
    };
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Update dashboard route
app.get('/dashboard', (req, res) => {
  const htmlPath = path.resolve(__dirname, '../../../src/dashboard/index.html');
  console.log('Serving dashboard from:', htmlPath);
  res.sendFile(htmlPath);
});

// Demo routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to GuardianJS Demo',
    botDetection: req.botDetection
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`GuardianJS Demo server running on port ${PORT}`);
});

export default app;