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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetTestServer = exports.getTestServer = exports.teardownTestServer = exports.setupTestServer = void 0;
const express_1 = require("../middleware/express");
let server = null;
const setupTestServer = () => __awaiter(void 0, void 0, void 0, function* () {
    server = yield (0, express_1.startServer)(0);
    return server;
});
exports.setupTestServer = setupTestServer;
const teardownTestServer = () => __awaiter(void 0, void 0, void 0, function* () {
    if (server) {
        yield (0, express_1.closeServer)(server);
        server = null;
    }
});
exports.teardownTestServer = teardownTestServer;
const getTestServer = () => server;
exports.getTestServer = getTestServer;
const resetTestServer = () => __awaiter(void 0, void 0, void 0, function* () {
    if (server) {
        yield (0, express_1.closeServer)(server);
        server = null;
    }
});
exports.resetTestServer = resetTestServer;
