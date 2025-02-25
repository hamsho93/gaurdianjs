// src/components/GuardianProvider.tsx
import React from 'react';
import { GuardianProvider as Provider } from '../integrations/react';
import type { GuardianConfig } from '../types';

interface Props {
  children: React.ReactNode;
  config?: Partial<GuardianConfig>;
}

export default function GuardianProvider({ children, config }: Props) {
  return <Provider config={config}>{children}</Provider>;
}