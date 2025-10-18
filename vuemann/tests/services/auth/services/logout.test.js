import {describe, expect, it, beforeEach, vi, beforeAll, afterEach} from "vitest";
import { ConfigLoader } from "@brugmann/vuemann/src/config/config-loader.js";
import { routerService } from "@brugmann/vuemann/src/services/router/init/router-service.js";
import { flashService } from "@brugmann/vuemann/src/services/flash/init/flash-service.js";
import { authService } from "@brugmann/vuemann/src/services/auth/init/auth-service.js";
import { createPinia, setActivePinia } from "pinia";
import { currentUser } from "@brugmann/vuemann/src/services/auth/src/models/current-user.js";
import { apiToken } from "@brugmann/vuemann/src/services/auth/src/models/api-token.js";


describe('auth logout', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    window.scrollTo = vi.fn();
  })

  afterEach(() => vi.resetAllMocks())
  it('logout', async () => {
    currentUser.set('John Doe')
    vi.spyOn(routerService, 'push')
    vi.spyOn(flashService, 'success')

    expect(currentUser.get()).toBe('John Doe'.toUpperCase())
    
    const apis = Object.entries(ConfigLoader.get('app.apis'))
    .filter(api => api[1].auth === true)
    .map(([api_name]) => api_name)

    for (const api_name of apis) apiToken.setTokens(api_name, 'test', 'test')

    const logoutListener = vi.fn()
    document.addEventListener('logout', logoutListener)

    authService.logout()
    
    expect(routerService.push).toHaveBeenCalledOnce()
    expect(flashService.success).toHaveBeenCalledOnce()
    expect(currentUser.get()).toBeUndefined()
    expect(logoutListener).toHaveBeenCalledOnce()

    for (const api_name of apis) {
      expect(apiToken.getAccessToken(api_name)).toBeNull()
      expect(apiToken.getRefreshToken(api_name)).toBeNull()
    }
  })
})
