"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiServer = exports.GuardianClient = exports.guardianMiddleware = exports.createGuardianMiddleware = exports.react = exports.express = exports.nextjs = exports.validateConfig = exports.analyzeBehavior = exports.analyzeTLS = exports.GuardianJS = void 0;
// Import the main class
const GuardianJS_1 = require("./core/GuardianJS");
Object.defineProperty(exports, "GuardianJS", { enumerable: true, get: function () { return GuardianJS_1.GuardianJS; } });
// Export utility functions
const TLSFingerprint_1 = require("./core/TLSFingerprint");
Object.defineProperty(exports, "analyzeTLS", { enumerable: true, get: function () { return TLSFingerprint_1.analyzeTLS; } });
const Behavior_1 = require("./core/Behavior");
Object.defineProperty(exports, "analyzeBehavior", { enumerable: true, get: function () { return Behavior_1.analyzeBehavior; } });
const validation_1 = require("./utils/validation");
Object.defineProperty(exports, "validateConfig", { enumerable: true, get: function () { return validation_1.validateConfig; } });
// Export framework integrations
const nextjs = __importStar(require("./integrations/nextjs"));
exports.nextjs = nextjs;
const express = __importStar(require("./integrations/express"));
exports.express = express;
const react = __importStar(require("./integrations/react"));
exports.react = react;
// Default export
exports.default = GuardianJS_1.GuardianJS;
// Export types
__exportStar(require("./types"), exports);
// Export middleware
__exportStar(require("./middleware/express"), exports);
__exportStar(require("./middleware/guardian"), exports);
// Export classes and functions
var express_1 = require("./middleware/express");
Object.defineProperty(exports, "createGuardianMiddleware", { enumerable: true, get: function () { return express_1.createGuardianMiddleware; } });
var guardian_1 = require("./middleware/guardian");
Object.defineProperty(exports, "guardianMiddleware", { enumerable: true, get: function () { return guardian_1.guardianMiddleware; } });
// Export Node.js client
var node_1 = require("./client/node");
Object.defineProperty(exports, "GuardianClient", { enumerable: true, get: function () { return node_1.GuardianClient; } });
// Export API server
var server_1 = require("./api/server");
Object.defineProperty(exports, "createApiServer", { enumerable: true, get: function () { return server_1.createApiServer; } });
