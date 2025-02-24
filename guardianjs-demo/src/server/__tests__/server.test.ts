import request from 'supertest';
import app from '../index';

describe('GuardianJS Demo Server', () => {
  test('GET / returns welcome message and bot detection', async () => {
    const response = await request(app)
      .get('/')
      .set('User-Agent', 'Mozilla/5.0');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Welcome to GuardianJS Demo');
    expect(response.body.botDetection).toBeDefined();
  });

  test('GET /api/status returns status and bot detection', async () => {
    const response = await request(app)
      .get('/api/status')
      .set('User-Agent', 'Googlebot');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.botDetection).toBeDefined();
  });
});