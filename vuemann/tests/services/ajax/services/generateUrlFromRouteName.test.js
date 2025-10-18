import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { routesApi } from '@brugmann/vuemann/src/config/routes-api-config.js';
import { app } from '@brugmann/vuemann/src/config/app-config.js';
import { ajaxService } from '@brugmann/vuemann/src/services/ajax/init/ajax-service.js';
import {createPinia, setActivePinia} from "pinia";
import { t } from '../../../../src/services/services-helper.js';
import { flashService } from '@brugmann/vuemann/src/services/flash/init/flash-service.js';

describe('route', () => {
  const route_name = 'getRoute'

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.spyOn(flashService, 'error').mockReturnValue(false)
  })

  afterEach(() => vi.resetAllMocks())
  
  it('lance une erreur pour une route inconnue', () => {
    expect(() => { 
      ajaxService.generateUrlFromRouteName('route_unknow', {}) 
    }).toThrow(t('v_route_unknow', {route_name : 'route_unknow'}))
  });
  
  it('lance une erreur pour des paramètres manquants', () => {
    expect(() => {
      ajaxService.generateUrlFromRouteName(route_name, {});
    }).toThrow(t('error_empty_parameter', { route_name }))
  });

  it('lance une erreur pour des paramètres non renseigné', () => {
    expect(() => {
      ajaxService.generateUrlFromRouteName(route_name, {'test' : 'test'})
    }).toThrow(t('error_missing_parameter', { route_name }))
  });

  it('routes globales sans api', () => {
    expect(() => {
      ajaxService.generateUrlFromRouteName('auth.token')
    }).toThrow(t('v_route_api_undefined', { route_name : 'auth.token' }))
  });

  it('routes globales avec api', () => {
    const result = ajaxService.generateUrlFromRouteName('auth.token', {}, 'api');

    expect(result).toBe('www.api.fr/v1/auth/token');
  });

  it('overwrirte routes globales', () => {
    const result = ajaxService.generateUrlFromRouteName('testApi.auth.token', {}, 'testApi');
    
    expect(result).toBe(app.apis.testApi.url + routesApi['testApi.auth.token'].url);
  });
  
  it('génère une URL valide avec les paramètres fournis', () => {
    const result = ajaxService.generateUrlFromRouteName(route_name, { id: 1 })

    expect(result).toBe('www.testApi.fr/test/1');
  });
  
  it('génère une URL valide avec les paramètres fournis et un paramètre get', () => {
    const result = ajaxService.generateUrlFromRouteName('getRoute', {'test' : 'test', id: 1 });
    
    expect(result).toBe('www.testApi.fr/test/1?test=test');
  });
});
