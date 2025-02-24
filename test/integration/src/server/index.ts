import express from 'express';
import { GuardianJS } from 'bot-guardian-js';
import { initDatabase } from '../database';

const app = express();
const PORT = 3000;

const guardian = new GuardianJS({
  endpoint: 'http://localhost:3000/track',
  trackingEnabled: true
});

app.use(express.json());

app.get('/test', (req, res) => {
  res.json({ message: 'Guardian Test Server Running' });
});

app.post('/check-bot', async (req, res) => {
  try {
    const clientIp = req.headers['x-forwarded-for'] || req.ip || '0.0.0.0';
    const result = await guardian.isBot({
      userAgent: req.headers['user-agent'] || 'Unknown',
      ip: typeof clientIp === 'string' ? clientIp : clientIp[0]
    });
    
    // Ensure we're sending an object with isBot property
    return res.json({ isBot: result });
  } catch (error) {
    console.error('Bot check error:', error);  // Add logging for debugging
    return res.status(500).json({ error: 'Bot check failed' });
  }
});

if (require.main === module) {
  initDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}

export default app;
