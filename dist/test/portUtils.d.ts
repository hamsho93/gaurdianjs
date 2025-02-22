export declare const validateTestPort: (port: number) => boolean;
export declare const getAvailablePort: (startPort?: number) => Promise<number>;
export declare const getTestPorts: (count?: number) => Promise<number[]>;
