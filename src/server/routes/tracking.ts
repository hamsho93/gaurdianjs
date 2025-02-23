import express from 'express';
import { Visit } from '../models/Visit';

const router = express.Router();

router.post('/track', async (req, res) => {
  try {
    const { clientId, sessionId, events } = req.body;

    if (!clientId || !sessionId || !events) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create or update visit
    const visit = await Visit.findOneAndUpdate(
      { clientId, sessionId },
      { 
        $set: { 
          clientId,
          sessionId,
          userAgent: req.body.userAgent,
          isBot: req.body.userAgent?.toLowerCase().includes('bot') || false
        },
        $push: { events: { $each: events } }
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, visit });
  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as trackingRouter }; 