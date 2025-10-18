import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { websocketFunctions, websocketFunctionsInternal } from '@brugmann/vuemann/src/services/websocket/src/websocket-functions.js';
import { flashService } from '@brugmann/vuemann/src/services/flash/init/flash-service.js';
import { t } from '@brugmann/vuemann/src/services/services-helper';
import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js';

describe('generateUrlFromRoute', () => {
    let getRouteFromConfigMock
    beforeEach(() => getRouteFromConfigMock = vi.spyOn(websocketFunctionsInternal, 'getRouteFromConfig'))
    afterEach(() => vi.resetAllMocks())

    it('should return an error when getRouteFromConfig returns a string', () => {
        getRouteFromConfigMock.mockReturnValue('ws_route_unknow')
        vi.spyOn(flashService, 'error').mockReturnValue(false)

        const result = websocketFunctions.generateUrlFromRoute('some_route');

        expect(flashService.error).toHaveBeenCalledWith(t('ws_route_unknow', { route_name: 'some_route' }));
        expect(getRouteFromConfigMock).toHaveBeenCalledExactlyOnceWith('some_route');
        expect(result).toBe(false); 
    });

    it('should return an error when API is undefined in config', () => {
        const route = { api: 'some_api', url: '/some_url' };
        getRouteFromConfigMock.mockReturnValue(route);

        vi.spyOn(flashService, 'error').mockReturnValue(false)
        vi.spyOn(ConfigLoader, 'get').mockReturnValue(undefined)

        const result = websocketFunctions.generateUrlFromRoute('some_route');

        expect(flashService.error).toHaveBeenCalledExactlyOnceWith(t('ws_api_undefined', { api: 'some_api' }));
        expect(ConfigLoader.get).toHaveBeenCalledExactlyOnceWith(`app.apis.${route.api}`);
        expect(result).toBe(false);
    });

    it('should generate the correct URL when all information is available', () => {
        const route = { api: 'some_api', url: '/some_url' };
        getRouteFromConfigMock.mockReturnValue(route);

        const apiConfig = { url: 'http://example.com' };
        vi.spyOn(ConfigLoader, 'get').mockReturnValue(apiConfig)

        const result = websocketFunctions.generateUrlFromRoute('some_route');

        expect(result).toBe('ws://example.com/some_url');
    });
});
