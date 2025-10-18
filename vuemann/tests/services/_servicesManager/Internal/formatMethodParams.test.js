import { describe, it, expect } from 'vitest';
import { sericesManagerInternal } from '@brugmann/vuemann/src/services/services-manager.js'

describe('formatMethodParams', () => {
    it('should return undefined if method_params is undefined', () => {
        expect(sericesManagerInternal.formatMethodParams(undefined)).toBeFalsy();
    });

    it('should return an array if method_params is not an array', () => {
        expect(sericesManagerInternal.formatMethodParams('param')).toEqual(['param']);
        expect(sericesManagerInternal.formatMethodParams(123)).toEqual([123]);
        expect(sericesManagerInternal.formatMethodParams({ key: 'value' })).toEqual([{ key: 'value' }]);
        expect(sericesManagerInternal.formatMethodParams(true)).toEqual([true]);
    });

    it('should return the same array if method_params is already an array', () => {
        expect(sericesManagerInternal.formatMethodParams(['param'])).toEqual(['param']);
        expect(sericesManagerInternal.formatMethodParams([1, 2, 3])).toEqual([1, 2, 3]);
        expect(sericesManagerInternal.formatMethodParams([{ key: 'value' }])).toEqual([{ key: 'value' }]);
    });
});
