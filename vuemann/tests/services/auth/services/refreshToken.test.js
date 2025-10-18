import {describe, expect, it, beforeEach, vi} from "vitest";
import {createPinia, setActivePinia} from "pinia";
import { authRepository } from "@brugmann/vuemann/src/services/auth/src/repositories/auth-repository.js";
import { authService } from "@brugmann/vuemann/src/services/auth/init/auth-service.js";
import { apiToken } from "@brugmann/vuemann/src/services/auth/src/models/api-token.js";
import { currentUser } from "@brugmann/vuemann/src/services/auth/src/models/current-user.js";

describe('auth refresh', () => {
  const api_name = 'testApi'

  beforeEach(() =>{ 
    setActivePinia(createPinia())
    apiToken.removeTokens(api_name)
  })

  it('no localStorage token', async () => {
    authRepository.refreshToken = vi.fn()

    const res = await authService.refreshToken(api_name, {status :401})
    expect(authRepository.refreshToken).not.toBeCalled()
    expect(res).toStrictEqual({status : 401})
  })

  for(const status of [200, 400, 401, 403, 404, 422, 500]) {  
    it(`don't refresh if status ${status}`, async () => {
      apiToken.setTokens(api_name, 'test', 'test')
      authRepository.refreshToken = vi.fn()

      const res = await authService.refreshToken(api_name, {status})
      expect(authRepository.refreshToken).not.toBeCalled()
      expect(res).toStrictEqual({status})
    })
  }
    
  for(const status of [400, 401, 403, 404, 422, 500]) {   
    it(`if refresh token failed status ${status}`, async () => {
      apiToken.setTokens(api_name, 'test', 'test')
      vi.spyOn(authRepository, 'refreshToken').mockResolvedValue({status})

      const res = await authService.refreshToken(api_name, {status :401, data : { detail: 'expired' }})
      expect(res.status).toBe(status)
      expect(res.access_token).toBeUndefined()
      expect(apiToken.getAccessToken(api_name)).toBe('test')
    })
  }


  it('refresh token', async () => {
    localStorage.setItem('current_user', 'USERTEST')
    apiToken.setTokens(api_name, 'test', 'test')
    const res_mock = {status: 200, data : {access_token: 'newTokenTest'}}

    vi.spyOn(authRepository, 'refreshToken').mockResolvedValue(res_mock)

    const res = await authService.refreshToken(api_name, {status :401, data : { detail: 'expired' }})
    expect(res.status).toBe(res_mock.status)
    expect(res.access_token).toBe(res_mock.data.access_token)
    expect(apiToken.getAccessToken(api_name)).toBe(res_mock.data.access_token)
    expect(currentUser.get()).toBe('USERTEST')

    localStorage.removeItem('current_user')
  })
})
