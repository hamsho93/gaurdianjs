import mongoose from 'mongoose';
export declare const Visit: mongoose.Model<{
    score: number;
    isBot: boolean;
    confidence: number;
    reasons: string[];
    clientId: string;
    sessionId: string;
    createdAt: Date;
    behavior?: {
        mouseMovements: number;
        keystrokes: number;
        timeOnPage: number;
        scrolling: boolean;
    } | undefined;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    score: number;
    isBot: boolean;
    confidence: number;
    reasons: string[];
    clientId: string;
    sessionId: string;
    createdAt: Date;
    behavior?: {
        mouseMovements: number;
        keystrokes: number;
        timeOnPage: number;
        scrolling: boolean;
    } | undefined;
}>>;
