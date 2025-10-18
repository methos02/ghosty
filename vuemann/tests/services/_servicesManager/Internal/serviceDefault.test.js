import { describe, it, expect, vi, afterEach } from 'vitest';
import { sericesManagerInternal, servicesDefault } from '@brugmann/vuemann/src/services/services-manager.js'

describe('serviceDefault', () => {
    afterEach(() => vi.resetAllMocks())

    it('should return false if the service does not exist', () => {
        vi.spyOn(console, 'log').mockReturnValue(true);
        sericesManagerInternal.serviceDefault('unknownService', 'someMethod');

        expect(console.log).toBeCalledWith(`default service unknownService est inconnu`);
    });

    it('should return false if the method does not exist in the service', () => {
        vi.spyOn(console, 'log').mockReturnValue(true);        
        
        sericesManagerInternal.serviceDefault('locale', 'unknownMethod');
        expect(console.log).toBeCalledWith(`default service locale n'a pas la méthode unknownMethod`);
    });

    it('should call the service method without parameters', () => {
        servicesDefault['myService'] = { default: vi.fn().mockReturnValue('default used') }
        
        sericesManagerInternal.serviceDefault('myService', 'default', false);

        expect(servicesDefault.myService.default).toHaveBeenCalledExactlyOnceWith();
    });

    it('should call the service method with parameters if it exists', () => {
        servicesDefault['myService'] = { default: vi.fn().mockReturnValue('default used') }

        sericesManagerInternal.serviceDefault('myService', 'default', ['test']);

        expect(servicesDefault.myService.default).toHaveBeenCalledExactlyOnceWith('test');
    });
});
