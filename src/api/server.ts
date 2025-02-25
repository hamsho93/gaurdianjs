// src/api/server.ts
import express from 'express';
import cors from 'cors';
import { GuardianJS } from '../core/GuardianJS';
import { BotDetectionParams } from '../types';
import path from 'path';

export function createApiServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const guardian = new GuardianJS({
    useBehavior: true,
    threshold: 0.5,
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
            'facebookexternalhit',
            'testbot'
          ];
          const ua = params.userAgent.toLowerCase();
          return knownBots.some(bot => ua.includes(bot));
        },
        score: 1.0
      }
    ]
  });

  // Bot detection endpoint
  app.post('/detect', async (req, res) => {
    try {
      const { userAgent, ip, path } = req.body;
      
      const result = await guardian.isBot({
        userAgent,
        ip,
        req: { path }
      });
      
      res.json(result);
    } catch (error) {
      console.error('Detection error:', error);
      res.status(500).json({ error: 'Detection failed' });
    }
  });

  // Dashboard data endpoint
  app.get('/data', (req, res) => {
    const data = {
      totalRequests: 100,
      detectedBots: 25,
      recentDetections: [{
        isBot: false,
        score: 0,
        confidence: 0,
        userAgent: req.headers['user-agent'],
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
  });

  // Serve dashboard
  const dashboardPath = path.resolve(__dirname, '../../dashboard');
  app.use('/dashboard', express.static(dashboardPath));

  return app;
}

// Start server if run directly
if (require.main === module) {
  const PORT = process.env.PORT || 3333;
  const app = createApiServer();
  app.listen(PORT, () => {
    console.log(`GuardianJS API running on port ${PORT}`);
  });
}