import request from 'supertest';
import { app, startServer, closeServer, setGuardian } from '../express';
import { GuardianJS } from '../../core/GuardianJS';
import { setupTestServer, teardownTestServer } from '../../test/serverUtils';
import { getTestPorts } from '../../test/portUtils';
import { Server, IncomingMessage, ServerResponse } from 'http';
import express from 'express';
import { createMiddleware } from '../express';

type HttpServer = Server<typeof IncomingMessage, typeof ServerResponse>;

class TestServer {
  private _server: Server<typeof IncomingMessage, typeof ServerResponse>;

  constructor(server: Server<typeof IncomingMessage, typeof ServerResponse>) {
    this._server = server;
  }

  get server() {
    return this._server;
  }

  async close(): Promise<void> {
    return new Promise((resolve) => {
      if (this._server.listening) {
        this._server.close(() => resolve());
      } else {
        resolve();
      }
    });
  }

  static async create(): Promise<TestServer> {
    const server = await startServer(0);
    return new TestServer(server);
  }
}

describe('Express Server', () => {
  const originalGuardian = new GuardianJS();
  let server: HttpServer;

  beforeEach(async () => {
    server = await setupTestServer();
  });

  afterEach(async () => {
    await teardownTestServer();
  });

  test('should serve static files', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('GuardianJS Dashboard');
  });

  test('should handle 404 for non-existent routes', async () => {
    const response = await request(app).get('/non-existent-path');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Not found' });
  });

  describe('Tracking Endpoint', () => {
    test('should handle valid data', async () => {
      const mockGuardian = {
        detect: jest.fn().mockResolvedValue({ verdict: 'legitimate' })
      };
      setGuardian(mockGuardian as unknown as GuardianJS);

      const response = await request(app)
        .post('/track')
        .send({
          mouseMovements: [],
          scrollEvents: []
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ verdict: 'legitimate' });
    });

    test('should handle invalid JSON', async () => {
      const response = await request(app)
        .post('/track')
        .set('Content-Type', 'application/json')
        .send('{"invalid json"');
      
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid JSON payload' });
    });

    test('should handle missing mouse movements', async () => {
      const response = await request(app)
        .post('/track')
        .send({
          scrollEvents: []
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Mouse movements data is required' });
    });

    test('should handle invalid mouse movements', async () => {
      const response = await request(app)
        .post('/track')
        .send({
          mouseMovements: 'invalid',
          scrollEvents: []
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid mouse movements data' });
    });

    test('should handle missing scroll events', async () => {
      const response = await request(app)
        .post('/track')
        .send({
          mouseMovements: []
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Scroll events data is required' });
    });

    test('should handle invalid scroll events', async () => {
      const response = await request(app)
        .post('/track')
        .send({
          mouseMovements: [],
          scrollEvents: 'invalid'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid scroll events data' });
    });

    test('should handle detection failure', async () => {
      const mockGuardian = {
        detect: jest.fn().mockResolvedValue(null)
      };
      setGuardian(mockGuardian as unknown as GuardianJS);

      const response = await request(app)
        .post('/track')
        .send({
          mouseMovements: [],
          scrollEvents: []
        });
      
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Detection failed' });
    });

    test('should handle detection error', async () => {
      const mockGuardian = {
        detect: jest.fn().mockRejectedValue(new Error('Detection error'))
      };
      setGuardian(mockGuardian as unknown as GuardianJS);

      const response = await request(app)
        .post('/track')
        .send({
          mouseMovements: [],
          scrollEvents: []
        });
      
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Detection error' });
    });

    test('should handle server timeout', async () => {
      let timeoutCalled = false;
      
      server.on('timeout', () => {
        timeoutCalled = true;
      });

      server.emit('timeout');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(timeoutCalled).toBe(true);
      expect(server.listening).toBe(true);
    });
  });

  test('should handle dashboard data endpoint', async () => {
    const response = await request(app).get('/data');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('totalRequests');
    expect(response.body).toHaveProperty('detectedBots');
    expect(response.body).toHaveProperty('recentDetections');
  });

  describe('Server Management', () => {
    test('should start server on valid port', () => {
      expect(server.listening).toBe(true);
    });

    test('should handle invalid port number', async () => {
      await expect(startServer(NaN)).rejects.toThrow();
      await expect(startServer(-1)).rejects.toThrow();
      await expect(startServer(65536)).rejects.toThrow();
    });
  });

  describe('Server Events', () => {
    test('should handle timeout event', (done) => {
      server.once('timeout', () => {
        expect(server.listening).toBe(true);
        done();
      });
      server.emit('timeout');
    });

    test('should handle close event', (done) => {
      const originalClose = server.close.bind(server);
      const mockClose = jest.fn((cb?: (err?: Error) => void) => {
        if (cb) cb();
        return server;
      });

      // Override close method
      server.close = mockClose;

      server.close(() => {
        // Restore original close method
        server.close = originalClose;
        expect(mockClose).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('Server Middleware', () => {
    test('should create middleware', () => {
      const app = createMiddleware();
      expect(app).toBeDefined();
      expect(typeof app.use).toBe('function');
    });
  });
}); 