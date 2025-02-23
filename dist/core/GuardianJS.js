"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardianJS = void 0;
const UserAgent_1 = require("./UserAgent");
const TLSFingerprint_1 = require("./TLSFingerprint");
const Behavior_1 = require("./Behavior");
class GuardianJS {
    constructor(config = {}) {
        this.config = config;
    }
    middleware() {
        return async (req, res, next) => {
            const result = await this.detect(req);
            req.botDetection = result;
            next();
        };
    }
    async detect(req) {
        var _a, _b;
        const results = {
            userAgent: (0, UserAgent_1.analyzeUA)(req.headers['user-agent'] || ''),
            tls: this.config.useTLS ? await (0, TLSFingerprint_1.analyzeTLS)(req) : null,
            behavior: this.config.useBehavior ? await (0, Behavior_1.analyzeBehavior)(req) : null
        };
        return {
            verdict: Boolean(results.userAgent.isBot ||
                ((_a = results.tls) === null || _a === void 0 ? void 0 : _a.isSuspicious) ||
                ((_b = results.behavior) === null || _b === void 0 ? void 0 : _b.isBot)),
            userAgent: results.userAgent,
            tls: results.tls,
            behavior: results.behavior
        };
    }
}
exports.GuardianJS = GuardianJS;
