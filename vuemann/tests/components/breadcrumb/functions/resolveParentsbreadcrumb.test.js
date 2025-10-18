import { describe, it, expect, vi, afterEach } from 'vitest';
import { breadcrumb } from '@brugmann/vuemann/src/components/breadcrumb/breadcrumb-functions.js';
import { routerService } from '@brugmann/vuemann/src/services/router/init/router-service.js';
import { flashService } from '@brugmann/vuemann/src/services/flash/init/flash-service.js';
import { t } from '@brugmann/vuemann/src/services/services-helper.js';

describe('breadcrumb.resolveParents', () => {
    const parents = [
        { label: 'Home', route: 'home' },
        { label: 'About', route: 'about' }
    ];

    const mockRoutes = {
        home: { name: 'home' },
        about: { name: 'about' }
    };

    afterEach(() => vi.clearAllMocks());

    it('should return an error when a route is missing', () => {
        vi.spyOn(flashService, 'error').mockReturnValue(false);
        vi.spyOn(routerService, 'getRoute').mockReturnValue(undefined)

        breadcrumb.resolveParents(parents, []);

        expect(routerService.getRoute).toHaveBeenCalledTimes(1);
        expect(flashService.error).toHaveBeenCalledExactlyOnceWith(t('breadcrumb.errors.route_unknown', {route_name: 'home'}));
    });
    
    it('should return the original links array when parents is empty', () => {
        vi.spyOn(flashService, 'error').mockReturnValue(false);
        vi.spyOn(routerService, 'getRoute')

        breadcrumb.resolveParents([], []);

        expect(flashService.error).toHaveBeenCalledExactlyOnceWith(t('breadcrumb.errors.parents'));
        expect(routerService.getRoute).not.toHaveBeenCalledTimes();
    });

    it('should resolve parents and add them to links', () => {
        vi.spyOn(routerService, 'getRoute').mockImplementation(route => mockRoutes[route]);

        const links = [];

        const result = breadcrumb.resolveParents(parents, links);

        expect(result).toEqual([
            { label: 'Home', route: {name: 'home'} },
            { label: 'About', route: {name: 'about'} }
        ]);
        expect(routerService.getRoute).toHaveBeenCalledTimes(2);
        expect(routerService.getRoute).toHaveBeenNthCalledWith(1, 'home');
        expect(routerService.getRoute).toHaveBeenNthCalledWith(2,'about');
    });
});
