"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = require("../express");
const GuardianJS_1 = require("../../core/GuardianJS");
const serverUtils_1 = require("../../test/serverUtils");
const portUtils_1 = require("../../test/portUtils");
const express_2 = __importDefault(require("express"));
const express_3 = require("../express");
describe('Express Server', () => {
    const originalGuardian = new GuardianJS_1.GuardianJS();
    let server;
    let testPort;
    beforeAll(async () => {
        [testPort] = await (0, portUtils_1.getTestPorts)(1);
    });
    beforeEach(async () => {
        await (0, express_1.closeServer)();
    });
    afterEach(async () => {
        (0, express_1.setGuardian)(originalGuardian);
        await (0, express_1.closeServer)();
        await (0, serverUtils_1.cleanupTestServer)();
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
            const server = await (0, express_1.startServer)(testPort);
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
        let testPort;
        beforeEach(async () => {
            [testPort] = await (0, portUtils_1.getTestPorts)(1);
            await (0, express_1.closeServer)();
        });
        afterEach(async () => {
            await (0, express_1.closeServer)();
            // Allow event loop to clear
            await new Promise(resolve => setTimeout(resolve, 100));
        });
        test('should handle invalid port number', async () => {
            await expect((0, express_1.startServer)(NaN)).rejects.toThrow('Invalid port number');
            await expect((0, express_1.startServer)(-1)).rejects.toThrow('Invalid port number');
            await expect((0, express_1.startServer)(65536)).rejects.toThrow('Invalid port number');
        });
        test('should handle server timeout', async () => {
            const server = await (0, express_1.startServer)(testPort);
            expect(server).toBeTruthy();
            // Simulate timeout
            server.emit('timeout');
            await (0, express_1.closeServer)();
        });
        test('should handle server close with error', async () => {
            const server = await (0, express_1.startServer)(testPort);
            // Mock server.close to simulate error
            const originalClose = server.close.bind(server);
            server.close = (callback) => {
                if (callback) {
                    callback(new Error('Mock close error'));
                }
                return server;
            };
            const result = await (0, express_1.closeServer)();
            expect(result).toBe(true);
            // Restore original close
            server.close = originalClose;
        });
        test('should handle non-listening server state', async () => {
            const server = await (0, express_1.startServer)(testPort);
            expect(server).toBeTruthy();
            // Force server into non-listening state
            await new Promise((resolve) => {
                server.close(() => {
                    resolve();
                });
            });
            const result = await (0, express_1.closeServer)();
            expect(result).toBe(true);
        });
    });
    describe('Error Handling', () => {
        beforeEach(async () => {
            [testPort] = await (0, portUtils_1.getTestPorts)(1);
            await (0, express_1.closeServer)();
        });
        afterEach(async () => {
            await (0, express_1.closeServer)();
        });
        test('should handle server close errors', async () => {
            const server = await (0, express_1.startServer)(testPort);
            // Mock server.close to simulate error
            const originalClose = server.close.bind(server);
            server.close = (callback) => {
                if (callback) {
                    callback(new Error('Mock close error'));
                }
                return server;
            };
            const result = await (0, express_1.closeServer)();
            expect(result).toBe(true);
            // Restore original close
            server.close = originalClose;
        });
        test('should handle detection errors', async () => {
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
        test('should handle unknown errors', async () => {
            const mockGuardian = {
                detect: jest.fn().mockRejectedValue('not an error object')
            };
            (0, express_1.setGuardian)(mockGuardian);
            const response = await (0, supertest_1.default)(express_1.app)
                .post('/track')
                .send({
                mouseMovements: [],
                scrollEvents: []
            });
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Unknown error' });
        });
        test('should handle validation errors with non-Error objects', async () => {
            const response = await (0, supertest_1.default)(express_1.app)
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
    let app;
    let server;
    beforeEach(() => {
        app = (0, express_2.default)();
    });
    afterEach((done) => {
        if (server && server.listening) {
            server.close(done);
        }
        else {
            done();
        }
    });
    describe('Server Timeout Handling', () => {
        it('should handle server timeout events', async () => {
            app = await (0, express_3.createMiddleware)();
            const result = await (0, express_1.startServer)(0);
            server = result;
            return new Promise((resolve) => {
                server.on('timeout', () => {
                    expect(server.listening).toBe(true);
                    resolve();
                });
                server.emit('timeout');
            });
        });
        it('should handle close events', async () => {
            app = await (0, express_3.createMiddleware)();
            const result = await (0, express_1.startServer)(0);
            server = result;
            return new Promise((resolve) => {
                const originalClose = server.close.bind(server);
                server.close = (callback) => {
                    if (callback)
                        callback();
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
