"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardianJS = void 0;
const UserAgent_1 = require("./UserAgent");
const TLSFingerprint_1 = require("./TLSFingerprint");
const Behavior_1 = require("./Behavior");
const default_1 = require("../config/default");
class GuardianJS {
    constructor(userConfig = {}) {
        this.events = [];
        this.config = {
            ...default_1.defaultConfig,
            ...userConfig
        };
    }
    track(event) {
        this.events.push({
            timestamp: Date.now(),
            ...event
        });
        if (this.events.length >= (this.config.bufferSize || 10)) {
            this.flush();
        }
    }
    async flush() {
        if (this.events.length === 0)
            return;
        try {
            const response = await fetch(this.config.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.events),
            });
            if (response.ok) {
                this.events = [];
            }
        }
        catch (error) {
            console.error('Error flushing events:', error);
        }
    }
    async isBot(params) {
        var _a, _b;
        const { userAgent, ip, req } = params;
        if (/bot|crawler|spider|googlebot/i.test(userAgent)) {
            return true;
        }
        if (req && (this.config.useTLS || this.config.useBehavior)) {
            const results = {
                tls: this.config.useTLS ? await (0, TLSFingerprint_1.analyzeTLS)(req) : null,
                behavior: this.config.useBehavior ? await (0, Behavior_1.analyzeBehavior)(req) : null
            };
            return Boolean(((_a = results.tls) === null || _a === void 0 ? void 0 : _a.isSuspicious) ||
                ((_b = results.behavior) === null || _b === void 0 ? void 0 : _b.isBot));
        }
        return false;
    }
    middleware() {
        return async (req, res, next) => {
            const userAgent = req.headers['user-agent'] || '';
            const ip = req.ip;
            const isBot = await this.isBot({ userAgent, ip, req });
            if (isBot) {
                return res.status(403).json({ error: 'Bot detected' });
            }
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
