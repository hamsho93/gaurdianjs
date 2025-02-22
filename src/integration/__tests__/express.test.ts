import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { GuardianJS, DetectionResult } from '../../core/GuardianJS';

describe('Express Middleware Integration', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    const guardian = new GuardianJS();
    app.use(express.json());
    app.use((req: Request, res: Response, next: NextFunction) => {
      guardian.middleware()(req, res, next);
    });

    app.get('/test', (req: Request, res: Response) => {
      if (req.botDetection?.verdict) {
        res.status(403).json({ error: 'Bot detected' });
      } else {
        res.status(200).json({ status: 'ok' });
      }
    });
  });

  test('should detect bot requests', async () => {
    const response = await request(app)
      .get('/test')
      .set('User-Agent', 'Googlebot/2.1');

    expect(response.status).toBe(403);
  });

  test('should allow legitimate requests', async () => {
    const response = await request(app)
      .get('/test')
      .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');

    expect(response.status).toBe(200);
  });
}); 