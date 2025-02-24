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
const defaultConfig = {
    threshold: 0.5,
    useBehavior: true,
    customRules: []
};
class GuardianJS {
    constructor(config = {}) {
        this.events = [];
        this.config = Object.assign(Object.assign(Object.assign({}, defaultConfig), config), { customRules: [
                {
                    name: 'Known Bot Detection',
                    test: (params) => {
                        const knownBots = [
                            'googlebot',
                            'bingbot',
                            'yandexbot',
                            'duckduckbot',
                            'baiduspider',
                            'facebookexternalhit'
                        ];
                        const ua = params.userAgent.toLowerCase();
                        return knownBots.some(bot => ua.includes(bot));
                    },
                    score: 1.0
                },
                // Add LLM bot detection with more patterns
                {
                    name: 'LLM Bot Detection',
                    test: (params) => {
                        const llmBots = [
                            'gptbot',
                            'claude-web',
                            'anthropic',
                            'cohere',
                            'llama',
                            'bard',
                            'openai'
                        ];
                        const ua = params.userAgent.toLowerCase();
                        // More thorough check for GPTBot which might be in different formats
                        if (ua.includes('gpt') || ua.includes('openai')) {
                            return true;
                        }
                        return llmBots.some(bot => ua.includes(bot));
                    },
                    score: 1.0
                },
                ...(config.customRules || [])
            ] });
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
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let score = 0;
            const reasons = [];
            // Check for LLM bots first
            const llmBotPatterns = ['gptbot', 'claude', 'anthropic', 'cohere', 'llama', 'bard', 'openai'];
            const ua = params.userAgent.toLowerCase();
            const isLLMBot = llmBotPatterns.some(pattern => ua.includes(pattern)) || ua.includes('gpt');
            if (isLLMBot) {
                return {
                    isBot: true,
                    score: 1.0,
                    confidence: 1.0,
                    reasons: ['LLM Bot Pattern'],
                    behavior: (0, Behavior_1.analyzeBehavior)(),
                    timestamp: new Date(),
                    path: ((_a = params.req) === null || _a === void 0 ? void 0 : _a.path) || '',
                    userAgent: params.userAgent,
                    ip: params.ip
                };
            }
            // Then check custom rules
            for (const rule of this.config.customRules) {
                if (rule.test(params)) {
                    score += rule.score;
                    reasons.push(rule.name);
                }
            }
            // Use analyzeBehavior from Behavior.ts
            const behavior = (0, Behavior_1.analyzeBehavior)();
            return {
                isBot: score >= this.config.threshold,
                score,
                confidence: score,
                reasons,
                behavior,
                timestamp: new Date(),
                path: ((_b = params.req) === null || _b === void 0 ? void 0 : _b.path) || '',
                userAgent: params.userAgent,
                ip: params.ip
            };
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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const userAgent = req.headers['user-agent'] || '';
            const ip = req.ip || '';
            // Check for LLM bots first - this is the most direct approach
            const llmBotPatterns = ['gptbot', 'claude', 'anthropic', 'cohere', 'llama', 'bard', 'openai'];
            const ua = userAgent.toLowerCase();
            const isLLMBot = llmBotPatterns.some(pattern => ua.includes(pattern)) || ua.includes('gpt');
            if (isLLMBot) {
                return {
                    isBot: true,
                    score: 1.0,
                    confidence: 1.0,
                    reasons: ['LLM Bot Pattern'],
                    behavior: this.config.useBehavior ? (0, Behavior_1.analyzeBehavior)() : {
                        mouseMovements: 0,
                        keystrokes: 0,
                        timeOnPage: 0,
                        scrolling: false
                    },
                    timestamp: new Date(),
                    path: req.path || '',
                    userAgent,
                    ip
                };
            }
            // Then check against our custom rules
            const botCheck = yield this.isBot({ userAgent, ip, req });
            if (botCheck.isBot) {
                return botCheck;
            }
            // If not caught by custom rules, do deeper analysis
            const results = {
                userAgent: (0, UserAgent_1.analyzeUA)(userAgent),
                tls: this.config.useTLS ? yield (0, TLSFingerprint_1.analyzeTLS)(req) : null,
                behavior: this.config.useBehavior ? (0, Behavior_1.analyzeBehavior)() : null
            };
            return {
                isBot: Boolean(results.userAgent.isBot ||
                    ((_a = results.tls) === null || _a === void 0 ? void 0 : _a.isSuspicious)),
                score: results.userAgent.isBot ? 1.0 : 0,
                confidence: results.userAgent.isBot ? 1.0 : 0,
                reasons: results.userAgent.isBot ? ['User Agent Analysis'] : [],
                behavior: results.behavior || {
                    mouseMovements: 0,
                    keystrokes: 0,
                    timeOnPage: 0,
                    scrolling: false
                },
                timestamp: new Date(),
                path: req.path || '',
                userAgent,
                ip
            };
        });
    }
}
exports.GuardianJS = GuardianJS;
