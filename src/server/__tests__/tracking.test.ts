import request from 'supertest';
import express from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { trackingRouter } from '../routes/tracking';
import { Visit } from '../models/Visit';

describe('Tracking API', () => {
  let mongod: MongoMemoryServer;
  const app = express();
  app.use(express.json());
  app.use('/guardian', trackingRouter);

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.disconnect();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  beforeEach(async () => {
    await Visit.deleteMany({});
  });

  test('handles valid tracking data', async () => {
    const response = await request(app)
      .post('/guardian/track')
      .send({
        clientId: '123',
        sessionId: '456',
        userAgent: 'Mozilla/5.0',
        events: [{ type: 'click', timestamp: Date.now() }]
      });

    expect(response.status).toBe(200);
    const visit = await Visit.findOne({ clientId: '123' });
    expect(visit).toBeDefined();
  });

  test('handles bot detection', async () => {
    const response = await request(app)
      .post('/guardian/track')
      .send({
        clientId: '123',
        sessionId: '456',
        userAgent: 'Googlebot',
        events: [{ type: 'click', timestamp: Date.now() }]
      });

    expect(response.status).toBe(200);
    const visit = await Visit.findOne({ clientId: '123' });
    expect(visit?.isBot).toBe(true);
  });
}); 