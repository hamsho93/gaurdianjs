"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GuardianJS_1 = require("../../core/GuardianJS");
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
describe('End-to-End Bot Detection', () => {
    let app;
    let guardian;
    beforeAll(() => {
        app = (0, express_1.default)();
        guardian = new GuardianJS_1.GuardianJS({
            useTLS: true,
            useBehavior: true
        });
        app.use(express_1.default.json());
        app.use(guardian.middleware());
        app.get('/api/test', (req, res) => {
            res.json({ status: 'success' });
        });
    });
    test('complete detection flow', async () => {
        const response = await (0, supertest_1.default)(app)
            .get('/api/test')
            .set('User-Agent', 'Mozilla/5.0')
            .send({
            behaviorData: {
                mouseMovements: [],
                scrollEvents: []
            }
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status');
    });
});
