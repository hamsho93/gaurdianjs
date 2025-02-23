"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = require("../express");
const GuardianJS_1 = require("../../core/GuardianJS");
const serverUtils_1 = require("../../test/serverUtils");
const express_2 = require("../express");
class TestServer {
    constructor(server) {
        this._server = server;
    }
    get server() {
        return this._server;
    }
    async close() {
        return new Promise((resolve) => {
            if (this._server.listening) {
                this._server.close(() => resolve());
            }
            else {
                resolve();
            }
        });
    }
    static async create() {
        const server = await (0, express_1.startServer)(0);
        return new TestServer(server);
    }
}
describe('Express Server', () => {
    const originalGuardian = new GuardianJS_1.GuardianJS();
    let server;
    beforeEach(async () => {
        server = await (0, serverUtils_1.setupTestServer)();
    });
    afterEach(async () => {
        await (0, serverUtils_1.teardownTestServer)();
    });
    test('should serve static files', async () => {
        const response = await (0, supertest_1.default)(express_1.app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toContain('GuardianJS Dashboard');
    });
    test('should handle 404 for non-existent routes', async () => {
        const response = await (0, supertest_1.default)(express_1.app).get('/non-existent-path');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Not found' });
    });
    describe('Tracking Endpoint', () => {
        test('should handle valid data', async () => {
            const mockGuardian = {
                detect: jest.fn().mockResolvedValue({ verdict: 'legitimate' })
            };
            (0, express_1.setGuardian)(mockGuardian);
            const response = await (0, supertest_1.default)(express_1.app)
                .post('/track')
                .send({
                mouseMovements: [],
                scrollEvents: []
            });
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ verdict: 'legitimate' });
        });
        test('should handle invalid JSON', async () => {
            const response = await (0, supertest_1.default)(express_1.app)
                .post('/track')
                .set('Content-Type', 'application/json')
                .send('{"invalid json"');
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Invalid JSON payload' });
        });
        test('should handle missing mouse movements', async () => {
            const response = await (0, supertest_1.default)(express_1.app)
                .post('/track')
                .send({
                scrollEvents: []
            });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Mouse movements data is required' });
        });
        test('should handle invalid mouse movements', async () => {
            const response = await (0, supertest_1.default)(express_1.app)
                .post('/track')
                .send({
                mouseMovements: 'invalid',
                scrollEvents: []
            });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Invalid mouse movements data' });
        });
        test('should handle missing scroll events', async () => {
            const response = await (0, supertest_1.default)(express_1.app)
                .post('/track')
                .send({
                mouseMovements: []
            });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Scroll events data is required' });
        });
        test('should handle invalid scroll events', async () => {
            const response = await (0, supertest_1.default)(express_1.app)
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
            (0, express_1.setGuardian)(mockGuardian);
            const response = await (0, supertest_1.default)(express_1.app)
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
            (0, express_1.setGuardian)(mockGuardian);
            const response = await (0, supertest_1.default)(express_1.app)
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
        const response = await (0, supertest_1.default)(express_1.app).get('/data');
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
            await expect((0, express_1.startServer)(NaN)).rejects.toThrow();
            await expect((0, express_1.startServer)(-1)).rejects.toThrow();
            await expect((0, express_1.startServer)(65536)).rejects.toThrow();
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
            const mockClose = jest.fn((cb) => {
                if (cb)
                    cb();
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
            const app = (0, express_2.createMiddleware)();
            expect(app).toBeDefined();
            expect(typeof app.use).toBe('function');
        });
    });
});
