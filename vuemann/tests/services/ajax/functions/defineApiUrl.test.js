import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js';
import { ajaxFunctions } from '@brugmann/vuemann/src/services/ajax/src/ajax-functions.js';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { t } from '@brugmann/vuemann/src/services/services-helper.js';

describe('defineApiUrl', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.spyOn(ConfigLoader, 'get')
    })

    it('should return false if api_url is undefined and config.get returns undefined', () => {
        ConfigLoader.get.mockReturnValue(undefined);
        expect(() => ajaxFunctions.defineApiUrl('testApi')).toThrow(t('v_error_api_url', {api_name : 'testApi'}));
    });

    it('should return api_url if provided', () => {
        expect(ajaxFunctions.defineApiUrl('testApi', 'https://api.example.com')).toBe('https://api.example.com');
    });

    it('should return config.get value if api_url is undefined', () => {
        ConfigLoader.get.mockReturnValue('https://config-api.com');
        
        expect(ajaxFunctions.defineApiUrl('testApi')).toBe('https://config-api.com');
        expect(ConfigLoader.get).toHaveBeenCalledWith('app.apis.testApi.url');
    });
});
