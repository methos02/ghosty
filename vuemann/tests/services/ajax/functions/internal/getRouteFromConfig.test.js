import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ajaxFunctionsInternal } from '@brugmann/vuemann/src/services/ajax/src/ajax-functions';
import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js';

describe('getRouteFromConfig', () => {
    beforeEach(() => vi.clearAllMocks() );

    it('should return route from routesApi if it exists', () => {
        expect(ajaxFunctionsInternal.getRouteFromConfig('getRoute'))
        .toEqual({...ConfigLoader.get(`routesApi.getRoute`), name : 'getRoute'});
    });

    it('should return undefined if route does not exist in routesApi and routesApi.global', () => {
        expect(ajaxFunctionsInternal.getRouteFromConfig('unknownRoute'))
        .toBeFalsy();
    });

    it('should return route from specific API if it exists', () => {
        expect(ajaxFunctionsInternal.getRouteFromConfig('auth.token', 'testApi'))
        .toEqual({...ConfigLoader.get(`routesApi`)['testApi.auth.token'], name : 'testApi.auth.token'});
    });

    it('should return route from global if specific API route does not exist', () => {
        expect(ajaxFunctionsInternal.getRouteFromConfig('auth.verify'))
        .toEqual({...ConfigLoader.get(`routesApi.global`)['auth.verify'], name : 'auth.verify', global : true});
    });
});
