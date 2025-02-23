import { GuardianTracker, type TrackerConfig } from '../tracker';

describe('GuardianTracker', () => {
  let config: TrackerConfig;

  beforeEach(() => {
    config = {
      endpoint: 'test-endpoint',
      bufferSize: 5,
      flushInterval: 1000
    };
  });

  test('can be instantiated with config', () => {
    const tracker = new GuardianTracker(config);
    expect(tracker).toBeInstanceOf(GuardianTracker);
    expect(tracker.getEndpoint()).toBe('test-endpoint');
  });

  test('uses default values when not provided', () => {
    const minimalConfig: TrackerConfig = {
      endpoint: 'test-endpoint'
    };
    const tracker = new GuardianTracker(minimalConfig);
    expect(tracker).toBeInstanceOf(GuardianTracker);
    expect(tracker.getEndpoint()).toBe('test-endpoint');
  });
});
