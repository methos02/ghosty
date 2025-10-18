import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { requestInterceptor } from '@brugmann/vuemann/src/services/ajax/src/models/request-interceptor.js';
import { apiToken } from "@brugmann/vuemann/src/services/auth/src/models/api-token.js";
import { Request } from '@brugmann/vuemann/src/services/ajax/src/models/request.js';

describe('intercepteurs Axios', () => {
  const api_name = 'api'
  let requestId;

  beforeEach(() => {
    apiToken.removeTokens(api_name)

    const route = { api: api_name, name: 'testRoute', method: 'get' };
    const datas = {};
    requestId = Request.init(route, datas);
  })

  it('should add x-requested and access-control', async () => {
    const config = requestInterceptor({ requestId });

    expect(config.headers['X-Requested-With']).toBe('XMLHttpRequest');
    expect(config.headers['Access-Control-Allow-Origin']).toBe('*');
  })

  it('ajout automatique du bearer token', async () => {
    Request.set({ api : api_name }, requestId)
    apiToken.setTokens('api', 'test', 'test')
    const config = requestInterceptor({ headers: {}, requestId });

    expect(config.headers['Authorization']).toBe('Bearer test');
    expect(config.headers['Access-Control-Allow-Origin']).toBe('*');
  })

  it('si le token request à la priorité sur le token api-token.js', async () => {
    Request.set({ api : api_name, method : 'get', token : 'request_token' }, requestId)
    apiToken.setTokens('api', 'test', 'test')
    const config = requestInterceptor({ headers: {}, requestId });

    expect(config.headers['Authorization']).toBe('Bearer request_token');
  })

  it('ajoute les en-têtes nécessaires à chaque requête', async () => {
    Request.set({ api : api_name, method : 'get', headers: { Host : "developer.mozilla.org"} }, requestId)
    const config = requestInterceptor({ requestId });

    expect(config.headers['Host']).toBe('developer.mozilla.org');
    expect(config.headers['X-Requested-With']).toBe('XMLHttpRequest');
    expect(config.headers['Access-Control-Allow-Origin']).toBe('*');
  })
});
