import { Server } from 'http';
export declare const setupTestServer: () => Promise<{
    server: Server;
    port: number;
}>;
export declare const cleanupTestServer: () => Promise<void>;
