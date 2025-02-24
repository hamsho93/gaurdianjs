// src/routes/guardian.ts
import { Router } from 'express';
import { guardianStorage } from '../services/guardianStorage';
import { DetectionResult } from '../types';

const router = Router();

// Protect these routes with your auth middleware
router.get('/detections', async (req, res) => {
  try {
    const detections = await guardianStorage.getDetections();
    res.json(detections);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch detections' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const detections = await guardianStorage.getDetections();
    
    const pathStats: Record<string, number> = detections.reduce((acc, curr) => {
      acc[curr.path] = (acc[curr.path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      total: detections.length,
      bots: detections.filter(d => d.isBot).length,
      paths: pathStats
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;