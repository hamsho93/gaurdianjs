"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("../middleware/express");
beforeAll(() => {
    process.env.NODE_ENV = 'test';
});
afterEach(async () => {
    await (0, express_1.closeServer)();
    // Allow event loop to clear
    await new Promise(resolve => setTimeout(resolve, 100));
});
afterAll(async () => {
    await (0, express_1.closeServer)();
    // Allow event loop to clear
    await new Promise(resolve => setTimeout(resolve, 1000));
});
// Add error handler for unhandled rejections
process.on('unhandledRejection', (error) => {
    console.error('Unhandled rejection:', error);
});
//# sourceMappingURL=setup.js.map