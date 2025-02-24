import { Express } from 'express';
import request from 'supertest';
import { DetectionResult } from '../types';

export const cleanupServer = async (app: Express): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  if ((app as any).server) {
    await new Promise(resolve => (app as any).server.close(resolve));
  }
};

export const mockMouseMovements = [
  { x: 100, y: 200, timestamp: Date.now() },
  { x: 150, y: 250, timestamp: Date.now() + 100 }
];

export const mockScrollEvents = [
  { scrollTop: 0, timestamp: Date.now() },
  { scrollTop: 100, timestamp: Date.now() + 200 }
];

export const makeRequest = (app: Express) => {
  return request(app)
    .post('/track')
    .send({
      mouseMovements: mockMouseMovements,
      scrollEvents: mockScrollEvents
    });
};

export const createTestVisit = async (app: Express, visit: Partial<DetectionResult>) => {
  return request(app)
    .post('/api/visits')
    .send(visit);
}; 