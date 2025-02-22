"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = void 0;
const default_1 = require("../config/default");
const validateConfig = (config) => {
    const validatedConfig = {
        ...default_1.defaultConfig,
        ...config
    };
    // Validate threshold
    if (typeof validatedConfig.threshold !== 'number' ||
        validatedConfig.threshold < 0 ||
        validatedConfig.threshold > 1) {
        throw new Error('Threshold must be a number between 0 and 1');
    }
    // Validate timeoutMs
    if (typeof validatedConfig.timeoutMs !== 'number' || validatedConfig.timeoutMs < 0) {
        throw new Error('Timeout must be a positive number');
    }
    // Validate maxRequestsPerMinute
    if (typeof validatedConfig.maxRequestsPerMinute !== 'number' ||
        validatedConfig.maxRequestsPerMinute < 0) {
        throw new Error('MaxRequestsPerMinute must be a positive number');
    }
    // Validate arrays
    validateArrays(validatedConfig.whitelist);
    validateArrays(validatedConfig.blacklist);
    // Validate custom rules
    if (validatedConfig.customRules) {
        validatedConfig.customRules.forEach(validateCustomRule);
    }
    return validatedConfig;
};
exports.validateConfig = validateConfig;
const validateArrays = (list) => {
    if (!Array.isArray(list.ips)) {
        throw new Error('IPs must be an array');
    }
    if (!Array.isArray(list.userAgents)) {
        throw new Error('UserAgents must be an array');
    }
    if (list.paths && !Array.isArray(list.paths)) {
        throw new Error('Paths must be an array');
    }
    if (list.patterns && !Array.isArray(list.patterns)) {
        throw new Error('Patterns must be an array');
    }
};
const validateCustomRule = (rule) => {
    if (typeof rule.name !== 'string') {
        throw new Error('Custom rule name must be a string');
    }
    if (typeof rule.condition !== 'function') {
        throw new Error('Custom rule condition must be a function');
    }
    if (typeof rule.weight !== 'number' || rule.weight < 0 || rule.weight > 1) {
        throw new Error('Custom rule weight must be a number between 0 and 1');
    }
};
//# sourceMappingURL=validation.js.map