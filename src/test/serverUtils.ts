import { Server } from 'http';
import { startServer, closeServer } from '../middleware/express';

let server: Server | null = null;

export const setupTestServer = async (): Promise<Server> => {
  server = await startServer(0);
  return server;
};

export const teardownTestServer = async (): Promise<void> => {
  if (server) {
    await closeServer(server);
    server = null;
  }
};

export const getTestServer = (): Server | null => server;

export const resetTestServer = async (): Promise<void> => {
  if (server) {
    await closeServer(server);
    server = null;
  }
}; 