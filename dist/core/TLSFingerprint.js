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
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeTLS = void 0;
function analyzeTLS(req) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const socket = req === null || req === void 0 ? void 0 : req.connection;
            if (!(socket === null || socket === void 0 ? void 0 : socket.getTLSFingerprint)) {
                return {
                    score: 0,
                    fingerprint: 'unknown',
                    version: 'unknown',
                    isSuspicious: false
                };
            }
            try {
                const fingerprint = socket.getTLSFingerprint();
                const version = ((_b = (_a = socket.getPeerCertificate) === null || _a === void 0 ? void 0 : _a.call(socket)) === null || _b === void 0 ? void 0 : _b.version) || '1.2';
                return {
                    score: 0.5,
                    fingerprint,
                    version,
                    isSuspicious: false
                };
            }
            catch (error) {
                return {
                    score: 0,
                    fingerprint: 'unknown',
                    version: 'unknown',
                    isSuspicious: false
                };
            }
        }
        catch (error) {
            return {
                score: 0,
                fingerprint: 'unknown',
                version: 'unknown',
                isSuspicious: false
            };
        }
    });
}
exports.analyzeTLS = analyzeTLS;
