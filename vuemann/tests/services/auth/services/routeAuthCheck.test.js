import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authService } from '@brugmann/vuemann/src/services/auth/init/auth-service.js';
import { authRepository } from '@brugmann/vuemann/src/services/auth/src/repositories/auth-repository.js';
import {createPinia, setActivePinia} from "pinia";
import { useAuthStore } from '@brugmann/vuemann/src/services/auth/auth-store.js';
import { apiToken } from '@brugmann/vuemann/src/services/auth/src/models/api-token.js';
import { currentUser } from '@brugmann/vuemann/src/services/auth/src/models/current-user.js';
import { authStore } from '@brugmann/vuemann/src/services/auth/auth-store.js';
import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js';

describe('routeAuthCheck', () => {
  const api_name = 'api'
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })
  
  afterEach(() => {
    vi.resetAllMocks()
    apiToken.removeTokens(api_name)
    currentUser.remove()
  })

  it('app.auth doit overide le param auth des routes', async () => {
    ConfigLoader.set('app.auth', false)

    const result = await authService.routeAuthCheck('api');
    expect(result).toBeTruthy();
    
    ConfigLoader.set('app.auth', undefined)
  })
  
  it('devrait renvoyer une erreur si le token est absent dans localStorage', async () => {
    currentUser.set('DOEJOH')
    const authStore = useAuthStore()

    const result = await authService.routeAuthCheck('api');
    expect(result).toBe(false);

    expect(authStore.errorAuth).toBe('access_error')
  });
  
  it('devrait renvoyer une erreur si le user est absent dans localStorage', async () => {
    apiToken.setTokens(api_name, 'validToken', 'validToken')
    const authStore = useAuthStore()

    const result = await authService.routeAuthCheck('api');
    expect(result).toBe(false);

    expect(authStore.errorAuth).toBe('access_error')
  });

  for(const status of [200, 404, 403, 422, 500]) {
    it(`don't refresh token if not ${status}`, async () => {
      currentUser.set('DOEJOH')
      apiToken.setTokens(api_name, 'validToken', 'validToken')
      
      authRepository.refreshToken = vi.fn()
      authRepository.verifyToken = vi.fn().mockResolvedValue({ status })
      
      const result = await authService.routeAuthCheck('api');
      
      expect(authRepository.verifyToken).toHaveBeenCalledWith('api');
      expect(authRepository.refreshToken).not.toBeCalled()
      expect(result).toBe(status === 200);
    });
  }

  it('refresh token success apres 401', async () => {
    currentUser.set('DOEJOH')
    apiToken.setTokens(api_name, 'validToken', 'validToken')

    authRepository.verifyToken = vi.fn().mockResolvedValue({ status: 401, data: { detail: 'expired' }});
    authRepository.refreshToken = vi.fn().mockResolvedValue({ status: 200, data : {access_token: 'newToken'}});

    const result = await authService.routeAuthCheck('api');
    
    expect(result).toBe(true)
    expect(authRepository.verifyToken).toHaveBeenCalledWith('api')
    expect(authRepository.refreshToken).toHaveBeenCalled()
    expect(authStore.getCurrentUser()).toBe('DOEJOH')
  });

  for(const status of [401, 404, 403, 422, 500]) {
    it(`refresh token fail status : ${status}`, async () => {
      currentUser.set('DOEJOH')
      const authStore = useAuthStore()
      
      apiToken.setTokens(api_name, 'validToken', 'validToken')
      authRepository.verifyToken = vi.fn().mockResolvedValue({ status: 401, data: { detail: 'expired' }});
      authRepository.refreshToken = vi.fn().mockResolvedValue({ status: status });
      
      const result = await authService.routeAuthCheck('api');
      
      expect(authRepository.verifyToken).toHaveBeenCalledWith('api');
      expect(authRepository.refreshToken).toHaveBeenCalled();
      expect(authStore.errorAuth).toBe('refresh_error')
      expect(result).toBe(false);
    });
  }
});
