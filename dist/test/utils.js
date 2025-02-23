"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRequest = exports.mockScrollEvents = exports.mockMouseMovements = exports.cleanupServer = void 0;
const supertest_1 = __importDefault(require("supertest"));
const cleanupServer = async (app) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    if (app.server) {
        await new Promise(resolve => app.server.close(resolve));
    }
};
exports.cleanupServer = cleanupServer;
exports.mockMouseMovements = [
    { x: 100, y: 200, timestamp: Date.now() },
    { x: 150, y: 250, timestamp: Date.now() + 100 }
];
exports.mockScrollEvents = [
    { scrollTop: 0, timestamp: Date.now() },
    { scrollTop: 100, timestamp: Date.now() + 200 }
];
const makeRequest = (app) => {
    return (0, supertest_1.default)(app)
        .post('/track')
        .send({
        mouseMovements: exports.mockMouseMovements,
        scrollEvents: exports.mockScrollEvents
    });
};
exports.makeRequest = makeRequest;
