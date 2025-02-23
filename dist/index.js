"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = exports.analyzeBehavior = exports.analyzeTLS = exports.GuardianJS = void 0;
// Import and export the main class
const GuardianJS_1 = require("./core/GuardianJS");
Object.defineProperty(exports, "GuardianJS", { enumerable: true, get: function () { return GuardianJS_1.GuardianJS; } });
// Export utility functions
const TLSFingerprint_1 = require("./core/TLSFingerprint");
Object.defineProperty(exports, "analyzeTLS", { enumerable: true, get: function () { return TLSFingerprint_1.analyzeTLS; } });
const Behavior_1 = require("./core/Behavior");
Object.defineProperty(exports, "analyzeBehavior", { enumerable: true, get: function () { return Behavior_1.analyzeBehavior; } });
const validation_1 = require("./utils/validation");
Object.defineProperty(exports, "validateConfig", { enumerable: true, get: function () { return validation_1.validateConfig; } });
// Default export
exports.default = GuardianJS_1.GuardianJS;
