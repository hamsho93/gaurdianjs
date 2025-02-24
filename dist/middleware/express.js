"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGuardianMiddleware = exports.middleware = exports.closeServer = exports.startServer = exports.createMiddleware = exports.setGuardian = exports.guardian = exports.app = void 0;
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
exports.app.post('/track', validateTrackingData, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield exports.guardian.detect(req);
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
}));
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
const createMiddleware = () => {
    const app = (0, express_1.default)();
    return app;
};
exports.createMiddleware = createMiddleware;
const startServer = (port = 3000) => __awaiter(void 0, void 0, void 0, function* () {
    if (isNaN(port) || port < 0 || port > 65535) {
        throw new Error('Invalid port number');
    }
    const app = (0, exports.createMiddleware)();
    return new Promise((resolve, reject) => {
        const server = app.listen(port, () => {
            resolve(server);
        }).on('error', reject);
    });
});
exports.startServer = startServer;
const closeServer = (server) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        if (server.listening) {
            server.close(() => resolve());
        }
        else {
            resolve();
        }
    });
});
exports.closeServer = closeServer;
exports.middleware = {
    create: exports.createMiddleware,
    start: exports.startServer,
    close: exports.closeServer
};
function createGuardianMiddleware(config = {}) {
    const guardian = new GuardianJS_1.GuardianJS(Object.assign({ useTLS: true, useBehavior: true }, config));
    return guardian;
}
exports.createGuardianMiddleware = createGuardianMiddleware;
