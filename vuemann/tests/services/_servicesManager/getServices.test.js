import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js';
import { ConfigState } from '../../utils/functions/config-state.js';

describe('services-manager getServices', () => {
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

  it('getServices', () => {
    const services = servicesM.getServices();
    expect(services).toContain('mockService');
    expect(services.length).toBeGreaterThan(0);
  });
});
