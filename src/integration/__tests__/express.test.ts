import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { GuardianJS, DetectionResult } from '../../core/GuardianJS';
import { DetectionResult as DetectionResultType } from '../../types';
import { guardianMiddleware } from '../../middleware/guardian';

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

  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeAll(() => {
    // Initialize mock objects before all tests
    mockReq = {
      headers: { 'user-agent': 'test-bot' },
      ip: '127.0.0.1',
      path: '/test'
    };

    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();
  });

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    mockReq.botDetection = undefined;
  });

  test('should handle bot detection', async () => {
    await guardianMiddleware(
      mockReq as Request,
      mockRes as Response,
      mockNext as NextFunction
    );

    expect(mockReq.botDetection).toBeDefined();
    if (mockReq.botDetection) {
      expect(typeof mockReq.botDetection.isBot).toBe('boolean');
      expect(typeof mockReq.botDetection.confidence).toBe('number');
    }

    expect(mockNext).toHaveBeenCalled();
  });

  test('should handle missing user agent', async () => {
    const reqWithoutUA = {
      ...mockReq,
      headers: {}
    };

    await guardianMiddleware(
      reqWithoutUA as Request,
      mockRes as Response,
      mockNext as NextFunction
    );

    expect(reqWithoutUA.botDetection).toBeDefined();
    expect(mockNext).toHaveBeenCalled();
  });

  test('should handle missing IP', async () => {
    const reqWithoutIP = {
      ...mockReq,
      ip: undefined
    };

    await guardianMiddleware(
      reqWithoutIP as Request,
      mockRes as Response,
      mockNext as NextFunction
    );

    expect(reqWithoutIP.botDetection).toBeDefined();
    expect(mockNext).toHaveBeenCalled();
  });
}); 