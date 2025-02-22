"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupTestServer = exports.setupTestServer = void 0;
const express_1 = require("../middleware/express");
const portUtils_1 = require("./portUtils");
const setupTestServer = async () => {
    const port = await (0, portUtils_1.getAvailablePort)();
    const server = await (0, express_1.startServer)(port);
    return { server, port };
};
exports.setupTestServer = setupTestServer;
const cleanupTestServer = async () => {
    await (0, express_1.closeServer)();
    await new Promise(resolve => setTimeout(resolve, 100));
};
exports.cleanupTestServer = cleanupTestServer;
//# sourceMappingURL=serverUtils.js.map