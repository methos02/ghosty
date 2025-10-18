import {describe, expect, it, beforeEach, afterEach, vi} from "vitest";
import {createPinia, setActivePinia} from "pinia";
import { useAuthStore } from "@brugmann/vuemann/src/services/auth/auth-store.js";
import { authFunctions } from "@brugmann/vuemann/src/services/auth/src/auth-functions.js";
import { ConfigLoader } from "@brugmann/vuemann/src/config/config-loader.js";
import { authRepository } from "@brugmann/vuemann/src/services/auth/src/repositories/auth-repository.js";
import { routerService } from "@brugmann/vuemann/src/services/router/init/router-service.js";
import { apiToken } from "@brugmann/vuemann/src/services/auth/src/models/api-token.js";
import { currentUser } from "@brugmann/vuemann/src/services/auth/src/models/current-user.js";

describe('auth login', () => {
    beforeEach(() => setActivePinia(createPinia()) )
    
    const apis = Object.entries(ConfigLoader.get('app.apis'))
        .filter(api => api[1].auth === true)
        .map(([api_name]) => api_name)

    it('username missing', async () => {      
      const authStore = useAuthStore()

      const res = await authFunctions.login(null, 'test')
      expect(res).toBe(false)
      expect(authStore.errorAuth).toBe('login_error_credentials')
    })
    
    it('password missing', async () => {      
      const authStore = useAuthStore()

      const res = await authFunctions.login('test', null)
      expect(res).toBe(false)
      expect(authStore.errorAuth).toBe('login_error_credentials')
    })
    
    it('credentials missing', async () => {      
      const authStore = useAuthStore()

      const res = await authFunctions.login(null, null)
      expect(res).toBe(false)
      expect(authStore.errorAuth).toBe('login_error_credentials')
    })
    
    it('should call user credentiel', async () => { 
      authRepository.getToken = vi.fn(() => { return { status: 401 } })

      await authFunctions.login('user_username','user_password')
      expect(authRepository.getToken).toBeCalledWith('user_username', 'user_password', 'api')
    })

    it('credentials api missing', async () => {  
      ConfigLoader.set('app.apis.api.username', 'api_username')
      ConfigLoader.set('app.apis.api.password', undefined)    
      const authStore = useAuthStore()

      const res = await authFunctions.login('user_username','user_password')
      expect(res).toBe(false)
      expect(authStore.errorAuth).toBe('login_error_api_credentials|api_name:api')

      ConfigLoader.set('app.apis.api.username', undefined)
      ConfigLoader.set('app.apis.api.password', undefined)
    })
    
    it('should call api credentiel', async () => { 
      ConfigLoader.set('app.apis.api.username', 'api_username')
      ConfigLoader.set('app.apis.api.password', 'api_password')
      authRepository.getToken = vi.fn(() => { return { status: 401 } })

      await authFunctions.login('user_username','user_password', 'api')
      expect(authRepository.getToken).toBeCalledWith('api_username', 'api_password', 'api')

      ConfigLoader.set('app.apis.api.username', undefined)
      ConfigLoader.set('app.apis.api.password', undefined)
    })

    it('error getToken', async () => { 
      const authStore = useAuthStore()
      authRepository.getToken = vi.fn(() => { return { status: 401 } })

      const res = await authFunctions.login('user_username','user_password')
      expect(res).toBe(false)
      expect(authStore.errorAuth).toBe('login_error_token')
    })

    it('success getToken', async () => { 
      authRepository.getToken = vi.fn(() => { return { status: 200, data : {access_token : 'token', refresh_token: 'refresh'} } })
      routerService.redirectAfterLogin = vi.fn()
      
      const res = await authFunctions.login('user_username','user_password')
      expect(res).toBe(true)

      for(const api_name of apis) { 
        expect(apiToken.getAccessToken(api_name)).toBe('token')
        expect(apiToken.getRefreshToken(api_name)).toBe('refresh')
      }

      expect(currentUser.get()).toBe('USER_USERNAME')
    })
})
