import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { createApp } from 'vue';
import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js';
import { ConfigState } from '../../utils/functions/config-state.js';

describe('initServices', () => {
  beforeEach(async () => {
    servicesM.resetServices();
  });

  afterAll(async () => {
    ConfigState.resetServices();
  });

  it('should initialize services with the provided object', async () => {
    const mockApp = createApp({});
    const mockServices = {
      api1: { services: { url: 'https://api1.com' } }
    };

    await servicesM.initServices(mockApp, mockServices);

    expect(servicesM.getServices()).toEqual(['api1Service']);
  });

  it('should override existing services', async () => {
    const mockApp = createApp({});
    await servicesM.initServices(mockApp, { oldApi: { services: { url: 'https://old.com' } } });

    const newServices = { newApi: { services: { url: 'https://new.com' } } };
    await servicesM.initServices(mockApp, newServices);

    expect(servicesM.getServices()).toEqual(['oldApiService', 'newApiService']);
  });
});
