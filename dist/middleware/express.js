"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeServer = exports.startServer = exports.setGuardian = exports.guardian = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const GuardianJS_1 = require("../core/GuardianJS");
exports.app = (0, express_1.default)();
exports.guardian = new GuardianJS_1.GuardianJS({
    useTLS: true,
    useBehavior: true
});
// For testing purposes
const setGuardian = (newGuardian) => {
    exports.guardian = newGuardian;
};
exports.setGuardian = setGuardian;
// Custom error types with status codes
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.status = 400;
    }
}
class DetectionError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.name = 'DetectionError';
        this.status = status;
    }
}
// Error handler middleware
const errorHandler = (err, _req, res, _next) => {
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
const validateTrackingData = (req, _res, next) => {
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
    }
    catch (error) {
        next(error instanceof Error ? error : new ValidationError('Invalid request data'));
    }
};
// Configure express
exports.app.use(express_1.default.json({
    strict: true,
    limit: '10kb'
}));
// Serve static files from dashboard
exports.app.use(express_1.default.static(path_1.default.join(__dirname, '../dashboard')));
// Create a default index.html if it doesn't exist
exports.app.get('/', (_req, res) => {
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
exports.app.post('/track', validateTrackingData, async (req, res, next) => {
    try {
        const result = await exports.guardian.detect(req);
        if (!result) {
            throw new DetectionError('Detection failed', 500);
        }
        res.json(result);
    }
    catch (error) {
        if (error instanceof Error) {
            next(new DetectionError(error.message, 500));
        }
        else {
            next(new DetectionError('Unknown error', 500));
        }
    }
});
// Get dashboard data
exports.app.get('/data', (_req, res, next) => {
    try {
        res.json({
            totalRequests: 100,
            detectedBots: 15,
            recentDetections: []
        });
    }
    catch (error) {
        next(error);
    }
});
// Handle 404
exports.app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
});
// Add error handler
exports.app.use(errorHandler);
let serverInstance = null;
let serverPromise = null;
const openConnections = new Set();
const cleanupServer = async (server) => {
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
const validatePort = (port) => {
    return Number.isInteger(port) && port >= 0 && port < 65536;
};
const startServer = async (port) => {
    if (serverInstance) {
        return serverInstance;
    }
    if (serverPromise) {
        return serverPromise;
    }
    if (!validatePort(port)) {
        throw new Error('Invalid port number');
    }
    serverPromise = new Promise((resolve, reject) => {
        try {
            const server = exports.app.listen(port);
            openConnections.add(server);
            server.once('listening', () => {
                serverInstance = server;
                serverPromise = null;
                resolve(server);
            });
            server.once('error', (error) => {
                openConnections.delete(server);
                serverInstance = null;
                serverPromise = null;
                reject(error);
            });
            server.once('close', () => {
                openConnections.delete(server);
            });
            server.setTimeout(5000);
        }
        catch (error) {
            serverInstance = null;
            serverPromise = null;
            reject(error);
        }
    });
    return serverPromise;
};
exports.startServer = startServer;
const closeServer = async () => {
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
    }
    catch (error) {
        if (process.env.NODE_ENV !== 'test') {
            console.error('Error closing server:', error);
        }
        serverInstance = null;
        serverPromise = null;
        return true;
    }
};
exports.closeServer = closeServer;
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
// Start the server if not in test environment
if (process.env.NODE_ENV !== 'test') {
    (0, exports.startServer)(3000).catch(console.error);
}
//# sourceMappingURL=express.js.map