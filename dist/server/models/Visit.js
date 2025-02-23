"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Visit = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const eventSchema = new mongoose_1.default.Schema({
    type: { type: String, required: true },
    target: String,
    timestamp: { type: Number, default: Date.now }
}, { _id: false, strict: false });
const visitSchema = new mongoose_1.default.Schema({
    clientId: { type: String, required: true },
    sessionId: { type: String, required: true },
    userAgent: String,
    isBot: { type: Boolean, default: false },
    events: [eventSchema]
}, {
    timestamps: true,
    strict: false
});
exports.Visit = mongoose_1.default.model('Visit', visitSchema);
