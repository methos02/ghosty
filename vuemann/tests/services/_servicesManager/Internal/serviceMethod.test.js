import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { sericesManagerInternal, servicesM } from '@brugmann/vuemann/src/services/services-manager.js';
import { ConfigState } from '../../../utils/functions/config-state.js';

describe('serviceMethod', () => {
  const testService = { myMethod: () => 'Hello' };

  beforeEach(async () => {
    ConfigState.resetServices({test: {services: testService}});
  });

  afterAll(async () => {
    ConfigState.resetServices();
  });

  it('should return an error if the service does not exist', () => {
    const errorMock = vi.spyOn(sericesManagerInternal, 'serviceError').mockReturnValue('Service error');
    const result = sericesManagerInternal.serviceMethod('unknownService', 'myMethod', 'test');

    expect(errorMock).toHaveBeenCalledWith('unknownService');
    expect(result).toBe('Service error');
  });

  it('should return an error if the method does not exist in the service', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = sericesManagerInternal.serviceMethod('testService', 'unknownMethod');

    expect(consoleSpy).toHaveBeenCalledWith('méthode unknownMethod inconnue dans le service testService');
    expect(result).toBeUndefined();

    consoleSpy.mockRestore();
  });

  it('should return the requested method from a service', () => {
    const result = sericesManagerInternal.serviceMethod('testService', 'myMethod');
    expect(result()).toBe('Hello');
  });
});
