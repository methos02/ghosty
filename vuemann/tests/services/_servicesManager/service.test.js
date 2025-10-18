import { describe, it, expect, vi, beforeAll, beforeEach, afterAll } from 'vitest';
import { servicesM, sericesManagerInternal } from '@brugmann/vuemann/src/services/services-manager.js';
import { ConfigState } from '../../utils/functions/config-state.js';

describe('services functions', () => {
  const mockService = { someMethod: vi.fn().mockReturnValue('mocked result') }

  beforeEach(async () => {
    ConfigState.resetServices({ mock: { services: mockService } });
  });

  afterAll(async () => {
    ConfigState.resetServices();
  });

  it('service unknow', () => {
    vi.spyOn(sericesManagerInternal, 'serviceError').mockReturnValue(undefined)
    vi.spyOn(sericesManagerInternal, 'serviceDefault').mockReturnValue(false)

    servicesM.service('nonExisting:someMethod');
    
    expect(sericesManagerInternal.serviceError).toHaveBeenCalledExactlyOnceWith('nonExistingService');
    expect(sericesManagerInternal.serviceDefault).toHaveBeenCalledExactlyOnceWith('nonExisting', 'someMethod', false);
  });

  it('method unknow', () => {
    vi.spyOn(console,'error').mockReturnValue(undefined)
    vi.spyOn(sericesManagerInternal, 'serviceDefault').mockReturnValue(false)

    servicesM.service('mock:unknowMethod');

    expect(sericesManagerInternal.serviceDefault).toHaveBeenCalledExactlyOnceWith('mock', 'unknowMethod', false)
    expect(console.error).toHaveBeenCalledExactlyOnceWith('méthode unknowMethod inconnue dans le service mockService')
  });
  
  it('service shortcut', () => {
    const result = servicesM.service('mock:someMethod');

    expect(result).toBe('mocked result');
    expect(mockService.someMethod).toHaveBeenCalled();
  });
  
  it('service', () => {
    const result = servicesM.service('mockService:someMethod');

    expect(result).toBe('mocked result');
    expect(mockService.someMethod).toHaveBeenCalled();
  });
});
