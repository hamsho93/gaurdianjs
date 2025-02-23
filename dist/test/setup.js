"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serverUtils_1 = require("./serverUtils");
beforeAll(async () => {
    await (0, serverUtils_1.setupTestServer)();
});
afterAll(async () => {
    await (0, serverUtils_1.teardownTestServer)();
});
beforeEach(async () => {
    await (0, serverUtils_1.setupTestServer)();
});
afterEach(async () => {
    await (0, serverUtils_1.teardownTestServer)();
});
// Add error handler for unhandled rejections
process.on('unhandledRejection', (error) => {
    console.error('Unhandled rejection:', error);
});
