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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = exports.defaultConfig = exports.closeServer = exports.startServer = exports.GuardianJS = exports.GuardianTracker = void 0;
// Import and re-export the tracker
const tracker_1 = require("./client/tracker");
exports.GuardianTracker = tracker_1.GuardianTracker;
// Export other utilities
var GuardianJS_1 = require("./core/GuardianJS");
Object.defineProperty(exports, "GuardianJS", { enumerable: true, get: function () { return GuardianJS_1.GuardianJS; } });
var express_1 = require("./middleware/express");
Object.defineProperty(exports, "startServer", { enumerable: true, get: function () { return express_1.startServer; } });
Object.defineProperty(exports, "closeServer", { enumerable: true, get: function () { return express_1.closeServer; } });
// Export default configuration
var default_1 = require("./config/default");
Object.defineProperty(exports, "defaultConfig", { enumerable: true, get: function () { return default_1.defaultConfig; } });
// Export utility functions
var validation_1 = require("./utils/validation");
Object.defineProperty(exports, "validateConfig", { enumerable: true, get: function () { return validation_1.validateConfig; } });
// Export core functionality
__exportStar(require("./core/UserAgent"), exports);
__exportStar(require("./core/TLSFingerprint"), exports);
__exportStar(require("./core/Behavior"), exports);
// For CommonJS compatibility
module.exports = exports.GuardianTracker;
module.exports.default = exports.GuardianTracker;
Object.defineProperty(module.exports, "__esModule", { value: true });
