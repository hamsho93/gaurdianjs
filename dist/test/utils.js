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
exports.createTestVisit = exports.makeRequest = exports.mockScrollEvents = exports.mockMouseMovements = exports.cleanupServer = void 0;
const supertest_1 = __importDefault(require("supertest"));
const cleanupServer = (app) => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise(resolve => setTimeout(resolve, 100));
    if (app.server) {
        yield new Promise(resolve => app.server.close(resolve));
    }
});
exports.cleanupServer = cleanupServer;
exports.mockMouseMovements = [
    { x: 100, y: 200, timestamp: Date.now() },
    { x: 150, y: 250, timestamp: Date.now() + 100 }
];
exports.mockScrollEvents = [
    { scrollTop: 0, timestamp: Date.now() },
    { scrollTop: 100, timestamp: Date.now() + 200 }
];
const makeRequest = (app) => {
    return (0, supertest_1.default)(app)
        .post('/track')
        .send({
        mouseMovements: exports.mockMouseMovements,
        scrollEvents: exports.mockScrollEvents
    });
};
exports.makeRequest = makeRequest;
const createTestVisit = (app, visit) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, supertest_1.default)(app)
        .post('/api/visits')
        .send(visit);
});
exports.createTestVisit = createTestVisit;
