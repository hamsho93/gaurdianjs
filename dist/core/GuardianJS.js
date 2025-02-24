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
exports.GuardianJS = void 0;
const UserAgent_1 = require("./UserAgent");
const TLSFingerprint_1 = require("./TLSFingerprint");
const Behavior_1 = require("./Behavior");
const default_1 = require("../config/default");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const Behavior_2 = require("./Behavior");
class GuardianJS {
    constructor(config = {}) {
        var _a, _b, _c, _d;
        this.events = [];
        this.config = {
            endpoint: config.endpoint || 'http://localhost:3000/api/detect',
            trackingEnabled: (_a = config.trackingEnabled) !== null && _a !== void 0 ? _a : true,
            threshold: config.threshold || 0.8,
            detectionThreshold: config.detectionThreshold || 0.5,
            trackingInterval: config.trackingInterval || 1000,
            bufferSize: config.bufferSize || 1000,
            useTLS: (_b = config.useTLS) !== null && _b !== void 0 ? _b : true,
            maxRetries: config.maxRetries || 3,
            timeout: config.timeout || 5000,
            cacheSize: config.cacheSize || 100,
            useBehavior: (_c = config.useBehavior) !== null && _c !== void 0 ? _c : true,
            enableBehaviorAnalysis: (_d = config.enableBehaviorAnalysis) !== null && _d !== void 0 ? _d : true,
            customRules: config.customRules || []
        };
        this.behaviorAnalyzer = new Behavior_2.BehaviorAnalyzer();
        // Log configuration for debugging
        console.log('GuardianJS initialized with config:', this.config);
    }
    track(event) {
        this.events.push(Object.assign({ timestamp: Date.now() }, event));
        if (this.events.length >= (this.config.bufferSize || 10)) {
            this.flush();
        }
    }
    flush() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.events.length === 0)
                return;
            try {
                const response = yield (0, cross_fetch_1.default)(this.config.endpoint || default_1.defaultConfig.endpoint, {
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
        });
    }
    isBot(params) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Checking bot detection for:', params);
            let score = 0;
            const reasons = [];
            // Apply custom rules
            if (this.config.customRules && this.config.customRules.length > 0) {
                console.log('Applying custom rules...');
                for (const rule of this.config.customRules) {
                    try {
                        console.log(`Testing rule: ${rule.name}`);
                        const ruleResult = yield Promise.resolve(rule.test(params));
                        if (ruleResult) {
                            score += rule.score;
                            reasons.push(rule.name);
                            console.log(`Rule ${rule.name} matched! Score: ${score}`);
                        }
                    }
                    catch (error) {
                        console.error(`Error in rule ${rule.name}:`, error);
                    }
                }
            }
            const isBot = score >= (this.config.threshold || 0.8);
            console.log('Final detection result:', { isBot, score, reasons });
            return {
                isBot,
                confidence: score,
                reasons,
                behavior: {
                    mouseMovements: 0,
                    keystrokes: 0,
                    timeOnPage: 0,
                    scrolling: false
                }
            };
        });
    }
    analyzeBehavior(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.behaviorAnalyzer.analyze(req);
        });
    }
    middleware() {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const userAgent = req.headers['user-agent'] || '';
            const ip = req.ip;
            const isBot = yield this.isBot({ userAgent, ip, req });
            if (isBot.isBot) {
                return res.status(403).json({ error: 'Bot detected', reasons: isBot.reasons });
            }
            next();
        });
    }
    detect(req) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const results = {
                userAgent: (0, UserAgent_1.analyzeUA)(req.headers['user-agent'] || ''),
                tls: this.config.useTLS ? yield (0, TLSFingerprint_1.analyzeTLS)(req) : null,
                behavior: this.config.useBehavior ? yield (0, Behavior_1.analyzeBehavior)(req) : null
            };
            return {
                verdict: Boolean(results.userAgent.isBot ||
                    ((_a = results.tls) === null || _a === void 0 ? void 0 : _a.isSuspicious) ||
                    ((_b = results.behavior) === null || _b === void 0 ? void 0 : _b.isBot)),
                userAgent: results.userAgent,
                tls: results.tls,
                behavior: results.behavior
            };
        });
    }
}
exports.GuardianJS = GuardianJS;
