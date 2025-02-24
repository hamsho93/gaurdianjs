"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestPorts = exports.getAvailablePort = exports.validateTestPort = void 0;
const net_1 = __importDefault(require("net"));
const validateTestPort = (port) => {
    if (!Number.isInteger(port))
        return false;
    if (port < 1024 || port > 65535)
        return false;
    return true;
};
exports.validateTestPort = validateTestPort;
const getAvailablePort = (startPort = 3000) => __awaiter(void 0, void 0, void 0, function* () {
    const server = net_1.default.createServer();
    server.unref(); // Prevent keeping the process alive
    return new Promise((resolve, reject) => {
        server.on('error', (err) => {
            server.unref();
            if (err.code === 'EADDRINUSE') {
                resolve((0, exports.getAvailablePort)(startPort + 1));
            }
            else {
                reject(err);
            }
        });
        server.listen(startPort, () => {
            const { port } = server.address();
            server.close(() => {
                resolve(port);
            });
        });
    });
});
exports.getAvailablePort = getAvailablePort;
const getTestPorts = (count = 1) => __awaiter(void 0, void 0, void 0, function* () {
    const ports = [];
    let lastPort = 3000;
    for (let i = 0; i < count; i++) {
        const port = yield (0, exports.getAvailablePort)(lastPort);
        ports.push(port);
        lastPort = port + 1;
    }
    return ports;
});
exports.getTestPorts = getTestPorts;
