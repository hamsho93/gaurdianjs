import { Express } from 'express';
import request from 'supertest';
import { DetectionResult } from '../types';
export declare const cleanupServer: (app: Express) => Promise<void>;
export declare const mockMouseMovements: {
    x: number;
    y: number;
    timestamp: number;
}[];
export declare const mockScrollEvents: {
    scrollTop: number;
    timestamp: number;
}[];
export declare const makeRequest: (app: Express) => request.Test;
export declare const createTestVisit: (app: Express, visit: Partial<DetectionResult>) => Promise<import("superagent/lib/node/response")>;
