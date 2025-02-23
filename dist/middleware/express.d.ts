/// <reference types="node" />
import { Application } from 'express';
import { GuardianJS } from '../core/GuardianJS';
import { Server } from 'http';
export declare const app: import("express-serve-static-core").Express;
export declare let guardian: GuardianJS;
export declare const setGuardian: (newGuardian: GuardianJS) => void;
export declare const createMiddleware: () => Application;
export declare const startServer: (port?: number) => Promise<Server>;
export declare const closeServer: () => Promise<boolean>;
export declare const middleware: {
    create: () => Application;
    start: (port?: number) => Promise<Server>;
};
