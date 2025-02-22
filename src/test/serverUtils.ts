import { Server } from 'http';
import { startServer, closeServer } from '../middleware/express';
import { getAvailablePort } from './portUtils';

export const setupTestServer = async (): Promise<{ server: Server; port: number }> => {
  const port = await getAvailablePort();
  const server = await startServer(port);
  return { server, port };
};

export const cleanupTestServer = async (): Promise<void> => {
  await closeServer();
  await new Promise(resolve => setTimeout(resolve, 100));
}; 