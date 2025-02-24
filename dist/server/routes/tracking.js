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
exports.trackingRouter = void 0;
const express_1 = __importDefault(require("express"));
const Visit_1 = require("../models/Visit");
const router = express_1.default.Router();
exports.trackingRouter = router;
router.post('/track', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { clientId, sessionId, events } = req.body;
        if (!clientId || !sessionId || !events) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Create or update visit
        const visit = yield Visit_1.Visit.findOneAndUpdate({ clientId, sessionId }, {
            $set: {
                clientId,
                sessionId,
                userAgent: req.body.userAgent,
                isBot: ((_a = req.body.userAgent) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes('bot')) || false
            },
            $push: { events: { $each: events } }
        }, { upsert: true, new: true });
        res.json({ success: true, visit });
    }
    catch (error) {
        console.error('Tracking error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
