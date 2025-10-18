import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { websocketFunctionsInternal } from '@brugmann/vuemann/src/services/websocket/src/websocket-functions.js';
import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js';

describe('getRouteFromConfig', () => {
    afterEach(() => vi.resetAllMocks())
  
    it('should return an error when route is not defined in config', () => {
        vi.spyOn(ConfigLoader, 'get').mockReturnValue({})

        const result = websocketFunctionsInternal.getRouteFromConfig('some_route');

        expect(result).toBe('ws_route_unknow')
    });

    it('should return an error when route API is not defined', () => {
        vi.spyOn(ConfigLoader, 'get').mockReturnValue({'some_route' : { url: '/some_url' }});

        const result = websocketFunctionsInternal.getRouteFromConfig('some_route');

        expect(result).toBe('ws_route_api_undefined');
    });

    it('should return an error when route URL is not defined', () => {
        vi.spyOn(ConfigLoader, 'get').mockReturnValue({'some_route' : { api: 'some_api' }});

        const result = websocketFunctionsInternal.getRouteFromConfig('some_route');

        expect(result).toBe('ws_route_url_undefined');
    });

    it('should return the route correctly with dot in name', () => {
        const result = websocketFunctionsInternal.getRouteFromConfig('testApi.auth.token');

        expect(result).toEqual({...ConfigLoader.get('routesApi')['testApi.auth.token'], name : "testApi.auth.token"});
    });

    it('should return the route correctly', () => {
        const result = websocketFunctionsInternal.getRouteFromConfig('wsRoute');

        expect(result).toEqual({...ConfigLoader.get('routesApi')['wsRoute'], name : 'wsRoute'});
    });
});
