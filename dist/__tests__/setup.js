"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
// Setup for MongoDB tests
let mongod;
beforeAll(async () => {
    // Ensure we're disconnected before creating a new connection
    await mongoose_1.default.disconnect();
    mongod = await mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose_1.default.connect(uri, {
        // Add mongoose connection options
        autoCreate: true,
        autoIndex: true,
    });
});
afterAll(async () => {
    if (mongoose_1.default.connection.readyState !== 0) {
        await mongoose_1.default.disconnect();
    }
    if (mongod) {
        await mongod.stop();
    }
});
afterEach(async () => {
    if (mongoose_1.default.connection.readyState !== 0) {
        const collections = mongoose_1.default.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }
    }
});
// Setup for client-side tests
global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve('')
}));
// Add other global mocks if needed
global.console = {
    ...console,
    // Customize console.error to not pollute test output
    error: jest.fn(),
    warn: jest.fn(),
};
