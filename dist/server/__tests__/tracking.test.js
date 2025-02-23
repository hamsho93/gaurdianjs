"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const tracking_1 = require("../routes/tracking");
const Visit_1 = require("../models/Visit");
describe('Tracking API', () => {
    let mongod;
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use('/guardian', tracking_1.trackingRouter);
    beforeAll(async () => {
        mongod = await mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose_1.default.disconnect();
        await mongoose_1.default.connect(uri);
    });
    afterAll(async () => {
        await mongoose_1.default.disconnect();
        await mongod.stop();
    });
    beforeEach(async () => {
        await Visit_1.Visit.deleteMany({});
    });
    test('handles valid tracking data', async () => {
        const response = await (0, supertest_1.default)(app)
            .post('/guardian/track')
            .send({
            clientId: '123',
            sessionId: '456',
            userAgent: 'Mozilla/5.0',
            events: [{ type: 'click', timestamp: Date.now() }]
        });
        expect(response.status).toBe(200);
        const visit = await Visit_1.Visit.findOne({ clientId: '123' });
        expect(visit).toBeDefined();
    });
    test('handles bot detection', async () => {
        const response = await (0, supertest_1.default)(app)
            .post('/guardian/track')
            .send({
            clientId: '123',
            sessionId: '456',
            userAgent: 'Googlebot',
            events: [{ type: 'click', timestamp: Date.now() }]
        });
        expect(response.status).toBe(200);
        const visit = await Visit_1.Visit.findOne({ clientId: '123' });
        expect(visit === null || visit === void 0 ? void 0 : visit.isBot).toBe(true);
    });
});
