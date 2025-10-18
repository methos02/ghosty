import { describe, it, expect, beforeEach, vi, afterEach, afterAll } from 'vitest';
import { httpClient } from '@brugmann/vuemann/src/services/ajax/src/models/http-client.js';
import { requestInterceptor } from '@brugmann/vuemann/src/services/ajax/src/models/request-interceptor.js';
import { responseErrorInterceptor } from '@brugmann/vuemann/src/services/ajax/src/models/response-error-interceptor.js';
import { Request } from '@brugmann/vuemann/src/services/ajax/src/models/request.js';
import axios from 'axios';

vi.mock('axios')

describe('http-client.js', () => {
    let requestId;

    beforeEach(() => {
        // Initialiser une requête pour chaque test
        const route = { api: 'testApi', name: 'testRoute', method: 'get' };
        const datas = { url: '/test-url' };
        requestId = Request.init(route, datas);
    });

    axios.create.mockReturnValue({
        interceptors: {
            request: { use: vi.fn() },
            response: { use: vi.fn() },
        },
        get: vi.fn().mockResolvedValue({ data: 'get response' }),
        post: vi.fn().mockResolvedValue({ data: 'post response' }),
        put: vi.fn().mockResolvedValue({ data: 'put response' }),
        patch: vi.fn().mockResolvedValue({ data: 'patch response' }),
        delete: vi.fn().mockResolvedValue({ data: 'delete response' }),
    });

    afterEach(() => vi.clearAllMocks())

    it('isDefine', () => {
        httpClient.set(undefined)
        expect(httpClient.isDefine()).toBeFalsy()

        httpClient.init(axios)
        expect(httpClient.isDefine()).toBeTruthy()
        httpClient.set(undefined)
    })

    it('should initialize getHttpClient() with correct interceptors', () => {
        const instance = httpClient.init(axios);
   
        expect(axios.create).toHaveBeenCalled();
        expect(instance.interceptors.request.use).toHaveBeenCalledWith(requestInterceptor);
        expect(instance.interceptors.response.use).toHaveBeenCalledWith(undefined, responseErrorInterceptor);
    });

    it('should call GET method correctly', async () => {
        const response = await httpClient.get(requestId)

        expect(response.data).toBe('get response')
    });

    it('should call POST method correctly', async () => {
        const response = await httpClient.post(requestId, { foo: 'bar' })

        expect(response.data).toBe('post response')
    });

    it('should call PUT method correctly', async () => {
        const response = await httpClient.put(requestId, { foo: 'bar' })

        expect(response.data).toBe('put response')
    });

    it('should call PATCH method correctly', async () => {
        const response = await httpClient.patch(requestId, { foo: 'bar' })

        expect(response.data).toBe('patch response');
    });

    it('should call DELETE method correctly', async () => {
        const response = await httpClient.delete(requestId)

        expect(response.data).toBe('delete response')
    });

    //serealiser
    describe('customParamsSerializer', () => {
        it('doit retourner une chaîne vide pour un objet vide', () => {
          expect(httpClient.customParamsSerializer({})).toBe('');
        });
      
        it('doit sérialiser une paire clé-valeur simple', () => {
          expect(httpClient.customParamsSerializer({ foo: 'bar' })).toBe('foo=bar');
        });
      
        it('doit encoder correctement les clés et valeurs avec des caractères spéciaux', () => {
          expect(httpClient.customParamsSerializer({ 'foo bar': 'a&b' })).toBe('foo%20bar=a%26b');
        });
      
        it('doit gérer les tableaux en répétant la clé pour chaque valeur', () => {
          expect(httpClient.customParamsSerializer({ foo: ['bar', 'baz'] })).toBe('foo=bar&foo=baz');
        });
      
        it('doit ignorer les clés dont la valeur est undefined', () => {
          expect(httpClient.customParamsSerializer({ foo: undefined, bar: 'test' })).toBe('bar=test');
        });
      
        it('doit gérer un objet avec plusieurs types de valeurs', () => {
          const params = {
            a: 'one',
            b: ['two', 'three'],
            c: 4,
            d: undefined,
          };
          // L'ordre attendu est "a=one&b=two&b=three&c=4" (d est ignoré)
          expect(httpClient.customParamsSerializer(params)).toBe('a=one&b=two&b=three&c=4');
        });
      
        // Cas particulier : lorsque le tableau contient une valeur undefined, celle-ci n'est pas filtrée dans le tableau
        it('doit sérialiser les valeurs undefined dans un tableau (comportement défini)', () => {
          expect(httpClient.customParamsSerializer({ foo: [undefined, 'bar'] })).toBe('foo=undefined&foo=bar');
        });
    })
});
