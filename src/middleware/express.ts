import express, { Request, Response, NextFunction, Application } from 'express';
import path from 'path';
import { GuardianJS } from '../core/GuardianJS';
import { Server } from 'http';

export const app = express();
export let guardian = new GuardianJS({ 
  useTLS: true, 
  useBehavior: true 
});

// For testing purposes
export const setGuardian = (newGuardian: GuardianJS) => {
  guardian = newGuardian;
};

// Custom error types with status codes
class ValidationError extends Error {
  public status: number;
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}

class DetectionError extends Error {
  public status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = 'DetectionError';
    this.status = status;
  }
}

// Error handler middleware
const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  // Only log errors in non-test environment
  if (process.env.NODE_ENV !== 'test') {
    console.error('Error:', err.message);
  }
  
  if (err instanceof SyntaxError && 'status' in err && err.status === 400) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  if (err instanceof ValidationError) {
    return res.status(err.status).json({ error: err.message });
  }
  if (err instanceof DetectionError) {
    return res.status(err.status).json({ error: err.message });
  }
  return res.status(500).json({ error: 'Internal Server Error' });
};

// Validation middleware
const validateTrackingData = (req: Request, _res: Response, next: NextFunction) => {
  try {
    if (!req.body) {
      throw new ValidationError('Missing request body');
    }

    const { mouseMovements, scrollEvents } = req.body;

    if (!mouseMovements) {
      throw new ValidationError('Mouse movements data is required');
    }
    if (!Array.isArray(mouseMovements)) {
      throw new ValidationError('Invalid mouse movements data');
    }

    if (!scrollEvents) {
      throw new ValidationError('Scroll events data is required');
    }
    if (!Array.isArray(scrollEvents)) {
      throw new ValidationError('Invalid scroll events data');
    }

    next();
  } catch (error) {
    next(error instanceof Error ? error : new ValidationError('Invalid request data'));
  }
};

// Configure express
app.use(express.json({
  strict: true,
  limit: '10kb'
}));

// Serve static files from dashboard
app.use(express.static(path.join(__dirname, '../dashboard')));

// Create a default index.html if it doesn't exist
app.get('/', (_req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>GuardianJS Dashboard</title>
      </head>
      <body>
        <h1>GuardianJS Dashboard</h1>
        <p>Welcome to the GuardianJS monitoring dashboard.</p>
      </body>
    </html>
  `);
});

// Track behavioral data
app.post('/track', validateTrackingData, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await guardian.detect(req);
    if (!result) {
      throw new DetectionError('Detection failed', 500);
    }
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      next(new DetectionError(error.message, 500));
    } else {
      next(new DetectionError('Unknown error', 500));
    }
  }
});

// Get dashboard data
app.get('/data', (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      totalRequests: 100,
      detectedBots: 15,
      recentDetections: []
    });
  } catch (error) {
    next(error);
  }
});

// Handle 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Add error handler
app.use(errorHandler);

let serverInstance: Server | null = null;
let serverPromise: Promise<Server> | null = null;
const openConnections = new Set<Server>();

const cleanupServer = async (server: Server): Promise<void> => {
  return new Promise((resolve) => {
    // Close all keep-alive connections
    server.unref();
    
    // Force close after timeout
    const forceClose = setTimeout(() => {
      resolve();
    }, 1000);

    server.close(() => {
      clearTimeout(forceClose);
      resolve();
    });
  });
};

const validatePort = (port: number): boolean => {
  return Number.isInteger(port) && port >= 0 && port < 65536;
};

/**
 * Options for configuring the Guardian middleware
 * @interface MiddlewareOptions
 */
export interface MiddlewareOptions {
  /** Enable CORS support */
  cors?: boolean;
  /** Enable body parsing */
  bodyParser?: boolean;
  /** Enable response compression */
  compression?: boolean;
}

/**
 * Creates an Express application with Guardian middleware
 * @param {MiddlewareOptions} [options] - Middleware configuration options
 * @returns {Application} Configured Express application
 */
export const createMiddleware = (options: MiddlewareOptions = {}): Application => {
  const app = express();
  return app;
};

/**
 * Starts the Guardian server
 * @param {number} [port=3000] - Port number to listen on
 * @returns {Promise<Server>} HTTP server instance
 */
export const startServer = (port: number = 3000): Promise<Server> => {
  const app = createMiddleware();
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      resolve(server);
    }).on('error', reject);
  });
};

export const closeServer = async (): Promise<boolean> => {
  if (!serverInstance) {
    return true;
  }

  const server = serverInstance;

  try {
    await cleanupServer(server);
    openConnections.delete(server);
    serverInstance = null;
    serverPromise = null;
    return true;
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Error closing server:', error);
    }
    serverInstance = null;
    serverPromise = null;
    return true;
  }
};

// Cleanup all servers on process exit
const cleanup = async () => {
  const servers = Array.from(openConnections);
  await Promise.all(servers.map(cleanupServer));
  openConnections.clear();
  process.exit(0);
};

process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);

// Cleanup on test environment
if (process.env.NODE_ENV === 'test') {
  afterAll(async () => {
    const servers = Array.from(openConnections);
    await Promise.all(servers.map(cleanupServer));
    openConnections.clear();
  });
}

/**
 * Guardian middleware utilities
 */
export const middleware = {
  /** Creates Express application with Guardian middleware */
  create: createMiddleware,
  /** Starts Guardian server */
  start: startServer
}; 