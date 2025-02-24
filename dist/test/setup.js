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
const serverUtils_1 = require("./serverUtils");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, serverUtils_1.setupTestServer)();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, serverUtils_1.teardownTestServer)();
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, serverUtils_1.setupTestServer)();
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, serverUtils_1.teardownTestServer)();
}));
// Add error handler for unhandled rejections
process.on('unhandledRejection', (error) => {
    console.error('Unhandled rejection:', error);
});
