// src/middleware/guardian.ts
import { Request, Response, NextFunction } from 'express';
import { guardianStorage } from '../services/guardianStorage';
import { DetectionResult } from '../types';

export async function guardianMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const ip = req.ip || req.socket.remoteAddress || 'Unknown';

  try {
    const result = await guardianStorage.detectBot({
      userAgent,
      ip,
      req
    });

    const detection: DetectionResult = {
      timestamp: new Date(),
      isBot: result.isBot,
      confidence: result.confidence,
      path: req.path || '/',
      userAgent,
      ip,
      reasons: result.reasons,
      behavior: result.behavior
    };

    await guardianStorage.storeDetection(detection);
    req.botDetection = detection;
  } catch (error) {
    console.error('Guardian middleware error:', error);
  }

  next();
}