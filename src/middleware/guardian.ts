// src/middleware/guardian.ts
import { Request, Response, NextFunction } from 'express';
import { guardianStorage } from '../services/guardianStorage';
import { DetectionResult } from '../types';

export const guardianMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await guardianStorage.detectBot({
      userAgent: req.headers['user-agent'] || '',
      ip: req.ip || '',
      req
    });
    
    req.botDetection = result;
    next();
  } catch (error) {
    console.error('GuardianJS error:', error);
    next();
  }
};