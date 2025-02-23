"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const GuardianJS_1 = require("../../core/GuardianJS");
describe('Express Middleware Integration', () => {
    let app;
    beforeEach(() => {
        app = (0, express_1.default)();
        const guardian = new GuardianJS_1.GuardianJS();
        app.use(express_1.default.json());
        app.use((req, res, next) => {
            guardian.middleware()(req, res, next);
        });
        app.get('/test', (req, res) => {
            var _a;
            if ((_a = req.botDetection) === null || _a === void 0 ? void 0 : _a.verdict) {
                res.status(403).json({ error: 'Bot detected' });
            }
            else {
                res.status(200).json({ status: 'ok' });
            }
        });
    });
    test('should detect bot requests', async () => {
        const response = await (0, supertest_1.default)(app)
            .get('/test')
            .set('User-Agent', 'Googlebot/2.1');
        expect(response.status).toBe(403);
    });
    test('should allow legitimate requests', async () => {
        const response = await (0, supertest_1.default)(app)
            .get('/test')
            .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
        expect(response.status).toBe(200);
    });
});
