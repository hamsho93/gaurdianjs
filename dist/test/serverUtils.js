"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupTestServer = exports.setupTestServer = void 0;
const http_1 = require("http");
const express_1 = require("../middleware/express");
const setupTestServer = async () => {
    const server = (0, http_1.createServer)((req, res) => {
        res.writeHead(200);
        res.end('Test server');
    });
    await new Promise((resolve) => {
        server.listen(0, () => resolve());
    });
    const address = server.address();
    const port = address.port;
    return { server, port };
};
exports.setupTestServer = setupTestServer;
const cleanupTestServer = async () => {
    await (0, express_1.closeServer)();
    // Allow event loop to clear
    await new Promise(resolve => setTimeout(resolve, 100));
};
exports.cleanupTestServer = cleanupTestServer;
