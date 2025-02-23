import { Server, createServer } from 'http';
import { AddressInfo } from 'net';
import { startServer, closeServer } from '../middleware/express';
import { getAvailablePort } from './portUtils';

export const setupTestServer = async (): Promise<{ server: Server; port: number }> => {
  const server = createServer((req, res) => {
    res.writeHead(200);
    res.end('Test server');
  });

  await new Promise<void>((resolve) => {
    server.listen(0, () => resolve());
  });

  const address = server.address() as AddressInfo;
  const port = address.port;

  return { server, port };
};

export const cleanupTestServer = async (): Promise<void> => {
  await closeServer();
  // Allow event loop to clear
  await new Promise(resolve => setTimeout(resolve, 100));
}; 