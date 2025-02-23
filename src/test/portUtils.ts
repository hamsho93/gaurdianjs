import net from 'net';

export const validateTestPort = (port: number): boolean => {
  if (!Number.isInteger(port)) return false;
  if (port < 1024 || port > 65535) return false;
  return true;
};

export const getAvailablePort = async (startPort: number = 3000): Promise<number> => {
  const server = net.createServer();
  server.unref(); // Prevent keeping the process alive

  return new Promise((resolve, reject) => {
    server.on('error', (err: NodeJS.ErrnoException) => {
      server.unref();
      if (err.code === 'EADDRINUSE') {
        resolve(getAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });

    server.listen(startPort, () => {
      const { port } = server.address() as net.AddressInfo;
      server.close(() => {
        resolve(port);
      });
    });
  });
};

export const getTestPorts = async (count: number = 1): Promise<number[]> => {
  const ports: number[] = [];
  let lastPort = 3000;

  for (let i = 0; i < count; i++) {
    const port = await getAvailablePort(lastPort);
    ports.push(port);
    lastPort = port + 1;
  }

  return ports;
}; 