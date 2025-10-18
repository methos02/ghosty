import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {createPinia, setActivePinia} from "pinia";
import { useUtilsStore } from '@brugmann/vuemann/src/services/utils/src/utils-store';
import { utilsService } from '@brugmann/vuemann/src/services/utils/init/utils-service.js';
import { ajaxService } from '@brugmann/vuemann/src/services/ajax/init/ajax-service.js';
import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js';

describe('utilsService.apiStatus', () => {
  let utilsStore;

  beforeEach(() => {
    setActivePinia(createPinia()) 

    utilsStore = useUtilsStore()
        
    ConfigLoader.set('app', { apis: { 
      test : { url : 'www.test.com'}, 
      production : { url : 'www.production.com'}
    }})
  });

  afterEach(() =>  vi.resetAllMocks())

  it('should return true when all APIs are functional and instances are valid', async () => {
    vi.spyOn(ajaxService, 'req')
    .mockResolvedValueOnce({ status: 200, data: { instance: 'test' } })
    .mockResolvedValueOnce({ status: 200, data: { instance: 'production' } })

    const result = await utilsService.apiStatus();

    expect(result).toBe(true);
    expect(utilsStore.errorsGlobal).toHaveLength(0);
    expect(utilsStore.instances).toEqual({ production: 'production', test: 'test'});
  });

  it('should add errors to errorsGlobal when an API is down', async () => {
    vi.spyOn(ajaxService, 'req')
    .mockResolvedValueOnce({ status: 200, data: { instance: 'test' } })
    .mockResolvedValueOnce({ status: 500 })

    const result = await utilsService.apiStatus();

    expect(result).toBe(false);
    expect(utilsStore.errorsGlobal).toContain('error_api_down:api=production');
    expect(utilsStore.instances).toEqual({ test: 'test' });
  });

  it('should add errors to errorsGlobal when an API instance is invalid', async () => {
    vi.spyOn(ajaxService, 'req')
    .mockResolvedValueOnce({ status: 200, data: { instance: 'test' } })
    .mockResolvedValueOnce({ status: 200, data: { instance: 'wrong instance' } })

    const result = await utilsService.apiStatus();

    expect(result).toBe(false);
    expect(utilsStore.errorsGlobal).toContain('error_api_instance:api=production');
    expect(utilsStore.instances).toEqual({ test: 'test' });
  });

  it('should handle multiple errors from different APIs', async () => {
    vi.spyOn(ajaxService, 'req')
    .mockResolvedValueOnce({ status: 500 })
    .mockResolvedValueOnce({ status: 200, data: { instance: 'development' } });

    const result = await utilsService.apiStatus();

    expect(result).toBe(false);
    expect(utilsStore.errorsGlobal).toEqual([
      'error_api_down:api=test',
      'error_api_instance:api=production',
    ]);
    expect(utilsStore.instances).toEqual({});
  });
});
