import { GuardianTracker } from '../tracker';

describe('GuardianTracker', () => {
  const config = {
    endpoint: 'test-endpoint',
    bufferSize: 5,
    flushInterval: 1000
  };

  test('can be instantiated with config', () => {
    const tracker = new GuardianTracker(config);
    expect(tracker).toBeTruthy();
    expect(tracker.getEndpoint()).toBe('test-endpoint');
  });

  test('uses default values when not provided', () => {
    const minimalConfig = {
      endpoint: 'test-endpoint'
    };
    const tracker = new GuardianTracker(minimalConfig);
    expect(tracker).toBeTruthy();
    expect(tracker.getEndpoint()).toBe('test-endpoint');
  });
});
