const { default: GuardianJS } = require("bot-guardian-js");
// Add fetch polyfill
global.fetch = require('node-fetch');

describe('GuardianJS Integration Tests', () => {
    let guardian;
    // Create a mock request object that we'll reuse
    const mockReq = {
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'x-forwarded-for': '127.0.0.1',
            'accept-language': 'en-US,en;q=0.9',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        },
        connection: {
            remoteAddress: '127.0.0.1'
        },
        socket: {
            remoteAddress: '127.0.0.1'
        },
        ip: '127.0.0.1'
    };

    beforeEach(() => {
        guardian = new GuardianJS({
            endpoint: 'http://localhost:3000/track',
            trackingEnabled: true,
            detectionThreshold: 0.8,
            trackingInterval: 1000,
            bufferSize: 10,
            useTLS: true,
            useBehavior: true,
            threshold: 0.7,
            enableBehaviorAnalysis: true,
            customRules: []
        });
    });

    test('@integration should initialize GuardianJS with correct configuration', () => {
        expect(guardian).toBeDefined();
        expect(guardian.config).toEqual({
            endpoint: 'http://localhost:3000/track',
            trackingEnabled: true,
            detectionThreshold: 0.8,
            trackingInterval: 1000,
            bufferSize: 10,
            useTLS: true,
            useBehavior: true,
            threshold: 0.7,
            enableBehaviorAnalysis: true,
            customRules: []
        });
        expect(guardian.events).toEqual([]);
    });

    test('@integration should detect bots with proper request data', async () => {
        const result = await guardian.detect(mockReq);
        expect(result).toBeDefined();
        expect(result).toEqual({
            behavior: {
                anomalies: expect.any(Array),
                confidence: expect.any(Number),
                isBot: expect.any(Boolean),
                patterns: expect.arrayContaining([
                    expect.objectContaining({
                        interactionSpeed: expect.any(Number),
                        mouseMovements: expect.any(Number),
                        scrollPatterns: expect.any(Number)
                    })
                ]),
                score: expect.any(Number)
            },
            tls: {
                fingerprint: expect.any(String),
                isSuspicious: expect.any(Boolean),
                score: expect.any(Number),
                version: expect.any(String)
            },
            userAgent: {
                browser: expect.any(String),
                device: expect.any(String),
                isBot: expect.any(Boolean),
                os: expect.any(String)
            },
            verdict: expect.any(Boolean)
        });
        
        const isBotResult = await guardian.isBot(mockReq);
        expect(isBotResult).toBeDefined();
        expect(typeof isBotResult).toBe('boolean');
    });

    test('@integration should track and flush events', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true })
            })
        );

        const event = {
            type: 'click',
            x: 100,
            y: 200,
            timestamp: Date.now()
        };

        await guardian.track(event);
        expect(guardian.events).toHaveLength(1);
        expect(guardian.events[0]).toEqual(event);
        
        await guardian.flush();
        expect(guardian.events).toHaveLength(0);
        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:3000/track',
            expect.objectContaining({
                method: 'POST',
                headers: expect.any(Object),
                body: expect.any(String)
            })
        );
    });

    test('@integration middleware should process requests correctly', async () => {
        const mockRes = {
            setHeader: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
            locals: {}
        };

        const mockNext = jest.fn();

        const middleware = guardian.middleware();
        await middleware(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalled();
        // Since the middleware doesn't set response locals, we'll just verify
        // that the request was processed without errors
        expect(mockNext).toHaveBeenCalledWith();
    });
});
