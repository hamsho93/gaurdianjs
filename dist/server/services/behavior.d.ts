interface BehaviorEvent {
    type: string;
    data: {
        x?: number;
        y?: number;
        acceleration?: number;
        speed?: number;
    };
    timestamp: number;
}
interface BehaviorAnalysis {
    isBot: boolean;
    confidence: number;
    factors: string[];
}
export declare function analyzeBehavior(events: BehaviorEvent[]): BehaviorAnalysis;
export {};
