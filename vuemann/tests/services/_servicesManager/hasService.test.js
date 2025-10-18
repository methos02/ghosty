import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js';
import { ConfigState } from '../../utils/functions/config-state.js';

describe('services-manager hasService', () => {
  const mockService = {
    init: vi.fn(),
    someMethod: vi.fn().mockReturnValue('mocked result'),
  };

  beforeEach(async () => {
    ConfigState.resetServices({ mock: { services: mockService } });
  });

  afterAll(async () => {
    ConfigState.resetServices();
  });

  it('not existing', () => {
    const result = servicesM.hasService('nonExisting');
    expect(result).toBe(false);
  });

  it('existing service shortcut', () => {
    const result = servicesM.hasService('mock');
    expect(result).toBe(true);
  });

  it('existing service', () => {
    const result = servicesM.hasService('mockService');
    expect(result).toBe(true);
  });
});
