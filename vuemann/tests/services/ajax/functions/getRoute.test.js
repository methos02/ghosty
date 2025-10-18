import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js';
import { ajaxFunctions } from '@brugmann/vuemann/src/services/ajax/src/ajax-functions.js';
import { createPinia, setActivePinia } from 'pinia';

describe('route', () => {

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.spyOn(ajaxFunctions, 'throwError').mockReturnValue(false)
  })

  afterEach(() => vi.resetAllMocks())

  it('lance une erreur pour une route inconnue', () => {
    ajaxFunctions.getRoute('unknownRoute')
    expect(ajaxFunctions.throwError).toHaveBeenCalledWith('v_route_unknow', {route_name : 'unknownRoute'})
  });

  it('lance une erreur pour une route sans api', () => {
    ConfigLoader.set('routesApi', {
      noApi: { url: '/test/{id}', method: 'get'}
    })

    ajaxFunctions.getRoute('noApi')

    expect(ajaxFunctions.throwError).toHaveBeenCalledWith('v_route_api_undefined', {route_name : 'noApi'})
  });

  it('lance une erreur pour une route sans method', () => {
    ConfigLoader.set('routesApi', {
      noMethod: { url: '/test/{id}', api: 'testApi'}
    })

    ajaxFunctions.getRoute('noMethod')
    expect(ajaxFunctions.throwError).toHaveBeenCalledWith('v_route_method_undefined', {route_name : 'noMethod'})
  });

  it('lance une erreur pour une route sans method', () => {
    ConfigLoader.set('routesApi', {
      noMethod: { url: '/test/{id}', api: 'testApi', method: "unknow_method"}
    })

    ajaxFunctions.getRoute('noMethod')
    expect(ajaxFunctions.throwError).toHaveBeenCalledWith('v_error_method_unknow', {route_name : 'noMethod'})
  });

  it('lance une erreur pour une route sans url', () => {
    ConfigLoader.set('routesApi', {
      noUrl: { method: 'get', api: 'testApi'}
    })

    ajaxFunctions.getRoute('noUrl')
    expect(ajaxFunctions.throwError).toHaveBeenCalledWith('v_route_url_undefined', {route_name : 'noUrl'})
  });
});
