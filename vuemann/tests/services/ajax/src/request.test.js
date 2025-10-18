import { describe, it, expect, beforeEach } from 'vitest';
import { Request } from '@brugmann/vuemann/src/services/ajax/src/models/request.js';

describe('request module', () => {
    let requestId;

    beforeEach(() => {
        // Initialiser une requête pour chaque test
        const route = { api: 'testApi', name: 'testRoute', method: 'get' };
        const datas = { param: 'value' };
        requestId = Request.init(route, datas);
    });

    it('should set request object correctly for GET method', () => {
        const route = { api: 'testApi', name: 'testRoute', method: 'get' };
        const datas = { param: 'value' };

        Request.set({ additional: 'data' }, requestId);

        expect(Request.get('api', requestId)).toBe('testApi');
        expect(Request.get('route', requestId)).toEqual({ api: 'testApi', name: 'testRoute', method: 'get' });
        expect(Request.get('param', requestId)).toBe('value');
        expect(Request.get('additional', requestId)).toBe('data');

    });

    it('should set request object correctly for POST method with options', () => {
        const route = { api: 'testApi', name: 'testRoute', method: 'post' };
        const datas = { param: 'value' }; // Ne devrait pas être utilisé
        const options = { body: 'data' };

        const postRequestId = Request.init(route, datas, options);

        expect(Request.get('api', postRequestId)).toBe('testApi');
        expect(Request.get('route', postRequestId)).toEqual({ api: 'testApi', name: 'testRoute', method: 'post' });
        expect(Request.get('body', postRequestId)).toBe('data');
    });

    it('should get the whole request object when no key is provided', () => {
        const result = Request.get(requestId);

        expect(result).toEqual({
            id: requestId,
            api: 'testApi',
            route: { api: 'testApi', name: 'testRoute', method: 'get' },
            param: 'value'
        });
    });

    it('should get a specific key from the request object', () => {
        expect(Request.get('api', requestId)).toBe('testApi');
        expect(Request.get('route', requestId)).toEqual({ api: 'testApi', name: 'testRoute', method: 'get' });
        expect(Request.get('param', requestId)).toBe('value');
    });

    it('should return undefined for non-existing keys', () => {
        expect(Request.get('nonExistingKey', requestId)).toBeUndefined();
    });

    it('should handle nested property access', () => {
        Request.set({ nested: { property: 'value' } }, requestId);
        
        expect(Request.get('nested.property', requestId)).toBe('value');
    });
});
