// src/integrations/react.tsx
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { GuardianJS } from '../core/GuardianJS';
import type { GuardianConfig, TrackingEvent } from '../types';

// Export the context so it can be imported elsewhere
export const GuardianContext = createContext<GuardianJS | null>(null);

interface GuardianProviderProps {
  children: React.ReactNode;
  config?: Partial<GuardianConfig>;
}

export function GuardianProvider({ children, config = {} }: GuardianProviderProps) {
  const guardian = useMemo(() => new GuardianJS({
    useBehavior: true,
    threshold: 0.5,
    ...config
  }), []);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const trackMouseMove = (e: MouseEvent) => {
      guardian.track({
        event: 'mousemove',
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      } as TrackingEvent);
    };
    
    const trackClick = (e: MouseEvent) => {
      guardian.track({
        event: 'click',
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      } as TrackingEvent);
    };
    
    window.addEventListener('mousemove', trackMouseMove);
    window.addEventListener('click', trackClick);
    
    return () => {
      window.removeEventListener('mousemove', trackMouseMove);
      window.removeEventListener('click', trackClick);
    };
  }, [guardian]);
  
  return (
    <GuardianContext.Provider value={guardian}>
      {children}
    </GuardianContext.Provider>
  );
}

export const useGuardian = () => useContext(GuardianContext);