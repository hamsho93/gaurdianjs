import { Server } from 'http';
export declare const setupTestServer: () => Promise<Server>;
export declare const teardownTestServer: () => Promise<void>;
export declare const getTestServer: () => Server | null;
export declare const resetTestServer: () => Promise<void>;
