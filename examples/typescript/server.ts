import express from 'express';
import { GuardianJS } from '../../dist';
import path from 'path';

interface CustomRequest extends express.Request {
  botDetection?: {
    isBot: boolean;
    confidence: number;
    reasons: string[];
  };
}

const app = express();
const guardian = new GuardianJS();

// Parse JSON bodies
app.use(express.json());

// Add GuardianJS middleware
app.use(guardian.middleware());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API endpoints
app.get('/api/status', (req: CustomRequest, res) => {
  res.json({
    protected: true,
    botDetection: req.botDetection
  });
});

app.post('/api/verify', async (req: CustomRequest, res) => {
  try {
    const result = await guardian.detect(req);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Detection failed' });
  }
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(3002, () => {
  console.log('TypeScript example running on http://localhost:3002');
}); 