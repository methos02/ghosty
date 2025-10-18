import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {createPinia, setActivePinia} from "pinia";
import { flashService } from '@brugmann/vuemann/src/services/flash/init/flash-service.js';
import { t } from '@brugmann/vuemann/src/services/services-helper.js';
import { ajaxService } from '@brugmann/vuemann/src/services/ajax/init/ajax-service.js';
import { ajaxFunctions } from '@brugmann/vuemann/src/services/ajax/src/ajax-functions.js';
import { httpClient } from '@brugmann/vuemann/src/services/ajax/src/models/http-client.js';
import { logService } from '@brugmann/vuemann/src/services/log/init/log-service.js';
import { RequestFunctions } from '@brugmann/vuemann/src/services/ajax/src/models/request.js';

describe('req', () => {
  const requestId = 'request-test'
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.spyOn(flashService, 'error').mockReturnValue(false)
    vi.spyOn(RequestFunctions, 'generateRequestId').mockReturnValue(requestId)
  })
  afterEach(() => vi.resetAllMocks())
  
  it("lance une erreur si le client n'a pas été intialisé", async () => {
    vi.spyOn(httpClient, 'isDefine').mockReturnValue(false)
    
    await expect(ajaxService.req('getRoute', {params: { id: 1 }})).rejects.toThrow(t('error_no_client'))
  });

  it("lance une erreur si la route n'est pas trouvées", async () => {
    vi.spyOn(ajaxFunctions, 'getRoute').mockImplementation(() => {
      throw new Error(t('v_route_method_undefined', {route_name : 'getRoute'}))
    })

    await expect(ajaxService.req('getRoute', {params: { id: 1 }})).rejects.toThrow(t('v_route_method_undefined', {route_name : 'getRoute'}))
  });

  it("lance une erreur si l'api url est invalide", async () => {
    vi.spyOn(ajaxFunctions, 'defineApiUrl').mockImplementation(() => {
      throw new Error(t('v_error_api_url', {api_name : 'testApi'}))
    })

    await expect(ajaxService.req('getRoute', {params: { id: 1 }})).rejects.toThrow(t('v_error_api_url', {api_name : 'testApi'}))
  });

  it("lance une erreur si l'url subdirectory est invalide", async () => {
    await expect(ajaxService.req('getRoute')).rejects.toThrow(t('error_empty_parameter', {route_name : 'getRoute'}))
  });

  it('effectue une requête GET avec les paramètres corrects', async () => {
    vi.spyOn(ajaxFunctions, 'defineApiUrl')
    httpClient.get = vi.fn().mockResolvedValue({ data: { success: true }, status: 200 })
    
    const response = await ajaxService.req('getRoute', {params: { id: 1 }});
    
    expect(ajaxFunctions.defineApiUrl).toHaveBeenCalledExactlyOnceWith('testApi', undefined)
    expect(response).toEqual({ data: { success: true }, status: 200, api: 'testApi', route: 'getRoute' })
    expect(httpClient.get).toHaveBeenCalled()
  });

  it('effectue une requête POST avec les paramètres corrects', async () => {
    httpClient.post = vi.fn().mockResolvedValue({ data: { success: true }, status: 200 })
    
    const response = await ajaxService.req('postRoute', { id: 1 });
    
    expect(response).toEqual({ data: { success: true }, status: 200, api: 'testApi', route: 'postRoute' })
    expect(httpClient.post).toHaveBeenCalled()
  });

  it('effectue une requête PATCH avec les paramètres corrects', async () => {
    httpClient.patch = vi.fn().mockResolvedValue({ data: { success: true }, status: 200 })
    
    const response = await ajaxService.req('patchRoute', { id: 1 });
    
    expect(response).toEqual({ data: { success: true }, status: 200, api: 'testApi', route: 'patchRoute' })
    expect(httpClient.patch).toHaveBeenCalled()
  });

  it('effectue une requête DELETE avec les paramètres corrects', async () => {
    httpClient.delete = vi.fn().mockResolvedValue({ data: { success: true }, status: 200 })
    
    const response = await ajaxService.req('deleteRoute', { id: 1 });
    
    expect(response).toEqual({ data: { success: true }, status: 200, api: 'testApi', route: 'deleteRoute' })
    expect(httpClient.delete).toHaveBeenCalled()
  });

  it('gère les erreurs avec flashError avec erreur 500', async () => {
    httpClient.get = vi.fn().mockRejectedValue({ 
      response: { status: 500, data: {} }, 
      code: 'ERR_UNKNOWN',
      config: { requestId: requestId }
    })
    vi.spyOn(flashService, 'error').mockReturnValue(false)
    vi.spyOn(logService, 'send').mockReturnValue(true)
    
    const response = await ajaxService.req('getRoute', { params: { id: 1 }});

    expect(response).toEqual({ api: 'testApi', route: 'getRoute', data: {}, status: 500 });
    expect(httpClient.get).toHaveBeenCalled()

    expect(flashService.error).toHaveBeenCalled()
    expect(flashService.error).toHaveBeenCalledWith(t('error_back'))
  });

  it('gère les erreurs avec flashError avec erreur 4**', async () => {
    vi.spyOn(flashService, 'error').mockReturnValue(false)
    httpClient.get = vi.fn().mockRejectedValue({ 
      response: { status: 422, validation: 'error'}, 
      code: 'ERR_UNKNOWN',
      config: { requestId: requestId }
    })
    vi.spyOn(logService, 'send').mockReturnValue(true)
    
    const response = await ajaxService.req('getRoute', { params: { id: 1 }});

    expect(response).toEqual({ api: 'testApi', route: 'getRoute', status: 422, validation: 'error' });
    expect(httpClient.get).toHaveBeenCalled()

    expect(flashService.error).toHaveBeenCalled()
    expect(flashService.error).toHaveBeenCalledWith(t('error_front'))
  });

  it('gère les annulation de requête', async () => {
    httpClient.get = vi.fn().mockRejectedValue({ 
      code: 'ERR_CANCELED',
      config: { requestId: requestId }
    })

    const response = await ajaxService.req('getRoute', { params: { id: 1 }});

    expect(response).toEqual({ api: 'testApi', route: 'getRoute', data: {}, status: 499 });
    expect(httpClient.get).toHaveBeenCalled()
  });

  it('gère les annulation de requête', async () => {
    vi.spyOn(flashService, 'error')
    vi.spyOn(ajaxService, 'generateUrlFromRouteName').mockReturnValueOnce('')
    httpClient.get = vi.fn().mockResolvedValue({ data: { success: true }, status: 200 })
    
    const response = await ajaxService.req('getRoute', { params: { id: 1 }});

    expect(flashService.error).not.toHaveBeenCalled()
    expect(response).toEqual({ data: { success: true }, status: 200, api: 'testApi', route: 'getRoute' });
    expect(httpClient.get).toHaveBeenCalled()
  });
});
