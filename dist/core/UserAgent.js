"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeUA = analyzeUA;
const ua_parser_js_1 = __importDefault(require("ua-parser-js"));
function analyzeUA(userAgent) {
    const parser = new ua_parser_js_1.default(userAgent);
    const result = parser.getResult();
    const isBot = /bot|crawler|spider|crawling/i.test(userAgent);
    return {
        isBot,
        browser: result.browser.name || 'unknown',
        os: result.os.name || 'unknown',
        device: result.device.type || 'desktop'
    };
}
