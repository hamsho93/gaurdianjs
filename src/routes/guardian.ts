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
    
    const pathStats = detections.reduce((acc: Record<string, number>, curr: DetectionResult) => {
      const path = curr.path || 'unknown';
      acc[path] = (acc[path] || 0) + 1;
      return acc;
    }, {});

    res.json({
      total: detections.length,
      bots: detections.filter(d => d.isBot).length,
      paths: pathStats
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.get('/data', async (req, res) => {
  try {
    const detections = guardianStorage.getDetections();
    const stats = guardianStorage.getStats();
    
    res.json({
      totalRequests: stats.totalRequests,
      detectedBots: stats.detectedBots,
      pathStats: stats.pathStats,
      recentDetections: detections.slice(0, 10)
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;