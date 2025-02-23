"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetTestServer = exports.getTestServer = exports.teardownTestServer = exports.setupTestServer = void 0;
const express_1 = require("../middleware/express");
let server = null;
const setupTestServer = async () => {
    server = await (0, express_1.startServer)(0);
    return server;
};
exports.setupTestServer = setupTestServer;
const teardownTestServer = async () => {
    if (server) {
        await (0, express_1.closeServer)(server);
        server = null;
    }
};
exports.teardownTestServer = teardownTestServer;
const getTestServer = () => server;
exports.getTestServer = getTestServer;
const resetTestServer = async () => {
    if (server) {
        await (0, express_1.closeServer)(server);
        server = null;
    }
};
exports.resetTestServer = resetTestServer;
