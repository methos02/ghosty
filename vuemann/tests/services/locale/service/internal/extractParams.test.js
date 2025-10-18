import { describe, it, expect, vi, afterEach, beforeAll } from 'vitest';
import { localeServiceInternal } from '@brugmann/vuemann/src/services/locale/init/locale-service.js';
import { flashService } from '@brugmann/vuemann/src/services/flash/init/flash-service.js';
import { t } from '@brugmann/vuemann/src/services/services-helper';

describe('extractParams', () => {
    afterEach(() => vi.resetAllMocks())

    it('should convert a string of parameters into an object', () => {
        const result = localeServiceInternal.extractParams('key1=value1|key2=value2');
        expect(result).toEqual({ key1: 'value1', key2: 'value2' });
    });

    it('should handle a single parameter correctly', () => {
        const result = localeServiceInternal.extractParams('key=value');
        expect(result).toEqual({ key: 'value' });
    });

    it('should return an empty object if the input is an empty string', () => {
        vi.spyOn(flashService, 'error').mockReturnValue(undefined)

        const result = localeServiceInternal.extractParams('');
        expect(result).toEqual({});
        expect(flashService.error).toHaveBeenCalledExactlyOnceWith(t('extract_params_empty'))
    });

    it('should handle missing values as undefined', () => {
        vi.spyOn(flashService, 'error').mockReturnValue(undefined)

        const result = localeServiceInternal.extractParams('key1=value1|key2=');
        expect(result).toEqual({ key1: 'value1' });
        expect(flashService.error).toHaveBeenCalledExactlyOnceWith(t('extract_params_missing_value', { key:'key2' }))
    });

    it('should handle missing keys correctly', () => {
        const result = localeServiceInternal.extractParams('=value1|key2=value2');
        expect(result).toEqual({ '': 'value1', key2: 'value2' });
    });

    it('should handle multiple "=" in a value correctly', () => {
        const result = localeServiceInternal.extractParams('key1=value=extra|key2=value2');
        expect(result).toEqual({ key1: 'value=extra', key2: 'value2' });
    });
});
