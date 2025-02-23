import { Express } from 'express';
import request from 'supertest';
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
