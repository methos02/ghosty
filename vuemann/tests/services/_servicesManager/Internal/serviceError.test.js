import { afterEach, describe, expect, it, vi } from 'vitest'
import { sericesManagerInternal, servicesM } from '@brugmann/vuemann/src/services/services-manager.js'

describe('serviceError', () => {
    afterEach(() => vi.resetAllMocks())

    it('should log the available services and trace an error', () => {
        vi.spyOn(console, 'error').mockReturnValue(true);
        vi.spyOn(console, 'trace').mockReturnValue(true);
        vi.spyOn(servicesM, 'getServices').mockReturnValue([])

        sericesManagerInternal.serviceError('unknownService');

        expect(servicesM.getServices).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledTimes(2);
        expect(console.error).toHaveBeenNthCalledWith(1, []);
        expect(console.error).toHaveBeenNthCalledWith(2, 'service unknownService inconnu');
        expect(console.trace).toHaveBeenCalled();
    });
});
