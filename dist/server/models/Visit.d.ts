import mongoose from 'mongoose';
export declare const Visit: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    isBot: boolean;
    clientId: string;
    sessionId: string;
    events: mongoose.Types.DocumentArray<{
        type: string;
        timestamp: number;
        target?: string | undefined;
    }>;
    userAgent?: string | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    isBot: boolean;
    clientId: string;
    sessionId: string;
    events: mongoose.Types.DocumentArray<{
        type: string;
        timestamp: number;
        target?: string | undefined;
    }>;
    userAgent?: string | undefined;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    isBot: boolean;
    clientId: string;
    sessionId: string;
    events: mongoose.Types.DocumentArray<{
        type: string;
        timestamp: number;
        target?: string | undefined;
    }>;
    userAgent?: string | undefined;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    strict: false;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    isBot: boolean;
    clientId: string;
    sessionId: string;
    events: mongoose.Types.DocumentArray<{
        type: string;
        timestamp: number;
        target?: string | undefined;
    }>;
    userAgent?: string | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    isBot: boolean;
    clientId: string;
    sessionId: string;
    events: mongoose.Types.DocumentArray<{
        type: string;
        timestamp: number;
        target?: string | undefined;
    }>;
    userAgent?: string | undefined;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    isBot: boolean;
    clientId: string;
    sessionId: string;
    events: mongoose.Types.DocumentArray<{
        type: string;
        timestamp: number;
        target?: string | undefined;
    }>;
    userAgent?: string | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
