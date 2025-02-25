// test-guardianjs/react-integration.test.js
const React = require('react');
const { render, act } = require('@testing-library/react');
const { GuardianProvider, useGuardian } = require('../dist/integrations/react');

// Mock window events
const mockMouseEvent = new MouseEvent('mousemove', {
  clientX: 100,
  clientY: 200
});

const mockClickEvent = new MouseEvent('click', {
  clientX: 150,
  clientY: 250
});

describe('React Integration', () => {
  // Mock component that uses the Guardian context
  const TestComponent = () => {
    const guardian = useGuardian();
    
    return (
      <div data-testid="test-component">
        {guardian ? 'Guardian Initialized' : 'No Guardian'}
      </div>
    );
  };
  
  test('GuardianProvider should provide context to children', () => {
    const { getByTestId } = render(
      <GuardianProvider>
        <TestComponent />
      </GuardianProvider>
    );
    
    expect(getByTestId('test-component').textContent).toBe('Guardian Initialized');
  });
  
  test('GuardianProvider should track mouse events', () => {
    // Create a spy on the track method
    const trackSpy = jest.spyOn(GuardianJS.prototype, 'track');
    
    render(
      <GuardianProvider>
        <TestComponent />
      </GuardianProvider>
    );
    
    // Simulate mouse events
    act(() => {
      window.dispatchEvent(mockMouseEvent);
      window.dispatchEvent(mockClickEvent);
    });
    
    // Verify track was called
    expect(trackSpy).toHaveBeenCalledTimes(2);
    
    // Clean up
    trackSpy.mockRestore();
  });

  test('React integration exports should be defined', () => {
    // Just check if the module can be imported without errors
    const reactIntegration = require('../dist/integrations/react');
    expect(reactIntegration).toBeDefined();
    expect(reactIntegration.GuardianProvider).toBeDefined();
    expect(reactIntegration.useGuardian).toBeDefined();
  });
});