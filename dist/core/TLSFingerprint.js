"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeTLS = void 0;
async function analyzeTLS(req) {
    var _a, _b;
    try {
        const cert = (_b = (_a = req.socket) === null || _a === void 0 ? void 0 : _a.getPeerCertificate) === null || _b === void 0 ? void 0 : _b.call(_a);
        return {
            isSuspicious: false,
            fingerprint: (cert === null || cert === void 0 ? void 0 : cert.fingerprint) || 'unknown'
        };
    }
    catch (error) {
        return {
            isSuspicious: false,
            fingerprint: 'unknown'
        };
    }
}
exports.analyzeTLS = analyzeTLS;
