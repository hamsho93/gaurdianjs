"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
let mongod;
beforeAll(async () => {
    // Close existing connections
    await mongoose_1.default.disconnect();
    // Create new memory server
    mongod = await mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongod.getUri();
    // Connect to memory server
    await mongoose_1.default.connect(uri);
});
afterAll(async () => {
    // Cleanup
    if (mongoose_1.default.connection.readyState) {
        await mongoose_1.default.connection.dropDatabase();
        await mongoose_1.default.connection.close();
    }
    if (mongod) {
        await mongod.stop();
    }
});
beforeEach(async () => {
    // Clear all collections
    const collections = mongoose_1.default.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
});
