import { GuardianJS } from '../../core/GuardianJS';
import express, { Request, Response } from 'express';
import request from 'supertest';
import { GuardianConfig } from '../../types';

describe('End-to-End Bot Detection', () => {
  let app: express.Application;
  let guardian: GuardianJS;

  beforeAll(() => {
    app = express();
    const config: GuardianConfig = {
      useTLS: true,
      useBehavior: true
    };
    guardian = new GuardianJS(config);

    app.use(express.json());
    app.use(guardian.middleware());
    
    app.get('/api/test', (req: Request, res: Response) => {
      res.json({ status: 'success' });
    });
  });

  test('complete detection flow', async () => {
    const response = await request(app)
      .get('/api/test')
      .set('User-Agent', 'Mozilla/5.0')
      .send({
        behaviorData: {
          mouseMovements: [],
          scrollEvents: []
        }
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status');
  });
}); 