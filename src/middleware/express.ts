import express, { Request, Response, NextFunction, Application } from 'express';
import path from 'path';
import { GuardianJS } from '../core/GuardianJS';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { GuardianConfig } from '../types';

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

export const createMiddleware = (): Application => {
  const app = express();
  return app;
};

export const startServer = async (port: number = 3000): Promise<Server> => {
  if (isNaN(port) || port < 0 || port > 65535) {
    throw new Error('Invalid port number');
  }

  const app = createMiddleware();
  
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      resolve(server);
    }).on('error', reject);
  });
};

export const closeServer = async (server: Server): Promise<void> => {
  return new Promise((resolve) => {
    if (server.listening) {
      server.close(() => resolve());
    } else {
      resolve();
    }
  });
};

export const middleware = {
  create: createMiddleware,
  start: startServer,
  close: closeServer
};

export function createGuardianMiddleware(config: GuardianConfig = {}) {
  const guardian = new GuardianJS({
    useTLS: true,
    useBehavior: true,
    ...config
  });

  return guardian;
} 