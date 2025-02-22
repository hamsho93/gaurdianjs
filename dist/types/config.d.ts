export interface GuardianConfig {
    threshold: number;
    enableBehaviorAnalysis: boolean;
    enableTLSFingerprinting: boolean;
    enableUserAgentAnalysis: boolean;
    timeoutMs: number;
    maxRequestsPerMinute: number;
    whitelist: {
        ips: string[];
        userAgents: string[];
        paths: string[];
    };
    blacklist: {
        ips: string[];
        userAgents: string[];
        patterns: RegExp[];
    };
    customRules?: CustomRule[];
}
export interface CustomRule {
    name: string;
    condition: (req: any) => boolean | Promise<boolean>;
    weight: number;
}
