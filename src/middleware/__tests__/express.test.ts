import request from 'supertest';
import { app, startServer, closeServer, setGuardian } from '../express';
import { GuardianJS } from '../../core/GuardianJS';
import { setupTestServer, cleanupTestServer } from '../../test/serverUtils';
import { getTestPorts } from '../../test/portUtils';
import { Server } from 'http';
import express from 'express';
import { createMiddleware } from '../express';

describe('Express Server', () => {
  const originalGuardian = new GuardianJS();
  let server: any;
  let testPort: number;

  beforeAll(async () => {
    [testPort] = await getTestPorts(1);
  });

  beforeEach(async () => {
    await closeServer();
  });

  afterEach(async () => {
    setGuardian(originalGuardian);
    await closeServer();
    await cleanupTestServer();
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
      const server = await startServer(testPort);
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
    let testPort: number;

    beforeEach(async () => {
      [testPort] = await getTestPorts(1);
      await closeServer();
    });

    afterEach(async () => {
      await closeServer();
      // Allow event loop to clear
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    test('should handle invalid port number', async () => {
      await expect(startServer(NaN)).rejects.toThrow('Invalid port number');
      await expect(startServer(-1)).rejects.toThrow('Invalid port number');
      await expect(startServer(65536)).rejects.toThrow('Invalid port number');
    });

    test('should handle server timeout', async () => {
      const server = await startServer(testPort);
      expect(server).toBeTruthy();
      
      // Simulate timeout
      server.emit('timeout');
      
      await closeServer();
    });

    test('should handle server close with error', async () => {
      const server = await startServer(testPort);
      
      // Mock server.close to simulate error
      const originalClose = server.close.bind(server);
      server.close = (callback?: (err?: Error) => void) => {
        if (callback) {
          callback(new Error('Mock close error'));
        }
        return server;
      };

      const result = await closeServer();
      expect(result).toBe(true);

      // Restore original close
      server.close = originalClose;
    });

    test('should handle non-listening server state', async () => {
      const server = await startServer(testPort);
      expect(server).toBeTruthy();
      
      // Force server into non-listening state
      await new Promise<void>((resolve) => {
        server.close(() => {
          resolve();
        });
      });
      
      const result = await closeServer();
      expect(result).toBe(true);
    });
  });

  describe('Error Handling', () => {
    beforeEach(async () => {
      [testPort] = await getTestPorts(1);
      await closeServer();
    });

    afterEach(async () => {
      await closeServer();
    });

    test('should handle server close errors', async () => {
      const server = await startServer(testPort);
      
      // Mock server.close to simulate error
      const originalClose = server.close.bind(server);
      server.close = (callback?: (err?: Error) => void) => {
        if (callback) {
          callback(new Error('Mock close error'));
        }
        return server;
      };

      const result = await closeServer();
      expect(result).toBe(true);

      // Restore original close
      server.close = originalClose;
    });

    test('should handle detection errors', async () => {
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

    test('should handle unknown errors', async () => {
      const mockGuardian = {
        detect: jest.fn().mockRejectedValue('not an error object')
      };
      setGuardian(mockGuardian as unknown as GuardianJS);

      const response = await request(app)
        .post('/track')
        .send({
          mouseMovements: [],
          scrollEvents: []
        });
      
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Unknown error' });
    });

    test('should handle validation errors with non-Error objects', async () => {
      const response = await request(app)
        .post('/track')
        .send({
          mouseMovements: 'invalid'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid mouse movements data' });
    });
  });
});

describe('Express Middleware', () => {
  let app: express.Application;
  let server: Server;

  beforeEach(() => {
    app = express();
  });

  afterEach((done) => {
    if (server && server.listening) {
      server.close(done);
    } else {
      done();
    }
  });

  describe('Server Timeout Handling', () => {
    it('should handle server timeout events', async () => {
      app = await createMiddleware();
      
      const result = await startServer(0);
      server = result;
      
      return new Promise<void>((resolve) => {
        server.on('timeout', () => {
          expect(server.listening).toBe(true);
          resolve();
        });
        
        server.emit('timeout');
      });
    });

    it('should handle close events', async () => {
      app = await createMiddleware();
      
      const result = await startServer(0);
      server = result;
      
      return new Promise<void>((resolve) => {
        const originalClose = server.close.bind(server);
        
        server.close = (callback?: (err?: Error) => void) => {
          if (callback) callback();
          return server;
        };

        server.close(() => {
          server.close = originalClose;
          resolve();
        });
      });
    });
  });

  // Add more test cases as needed...
}); 