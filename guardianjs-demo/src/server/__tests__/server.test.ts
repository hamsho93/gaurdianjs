import request from 'supertest';
import { app, server } from '../index';

describe('GuardianJS Demo Server', () => {
  test('GET / returns welcome message and identifies regular user agent', async () => {
    const response = await request(app)
      .get('/')
      .set('User-Agent', 'Mozilla/5.0');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Welcome to GuardianJS Demo');
    expect(response.body.botDetection).toBeDefined();
    expect(response.body.botDetection.isBot).toBe(false);
    expect(response.body.botDetection.confidence).toBe(0);
  });

  test('GET / correctly identifies Googlebot', async () => {
    const response = await request(app)
      .get('/')
      .set('User-Agent', 'Googlebot');

    expect(response.status).toBe(200);
    expect(response.body.botDetection.isBot).toBe(true);
    expect(response.body.botDetection.confidence).toBe(1);
    expect(response.body.botDetection.reasons).toContain('Known Bot Detection');
  });

  test('GET /data returns analytics data', async () => {
    const response = await request(app)
      .get('/data');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('totalRequests');
    expect(response.body).toHaveProperty('detectedBots');
    expect(response.body).toHaveProperty('recentDetections');
    expect(Array.isArray(response.body.recentDetections)).toBe(true);
  });

  afterAll(done => {
    server.close(done);
  });
});