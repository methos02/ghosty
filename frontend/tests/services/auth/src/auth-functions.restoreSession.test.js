import { describe, it, expect, vi, afterEach } from 'vitest'
import { AuthController } from '@/apis/ghosty/controllers/auth-controller.js'
import { authFunctions } from '@/services/auth/src/auth-functions.js'
import { createAuthStore } from '@/services/auth/src/auth-store.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { controllerError, controllerSuccess } from '&/utils/helpers/controller-response.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('auth-functions', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('restoreSession', () => {
    it('does not call the API when the cookie header carries no session witness', async () => {
      const store = createAuthStore()
      const me = vi.spyOn(AuthController, 'me')

      const result = await authFunctions.restoreSession(store, 'locale=fr')

      expect(me).not.toHaveBeenCalled()
      expect(result).toEqual({ status: STATUS.SUCCESS })
      expect(store.isAuthenticated.value).toBe(false)
    })

    it('forwards the cookie header to the API and fills the given store', async () => {
      const store = createAuthStore()
      const user = userSeeder.getUser()
      vi.spyOn(AuthController, 'me').mockResolvedValue(controllerSuccess({ user }))

      await authFunctions.restoreSession(store, 'ghosty_session=1; ghosty_token=abc')

      expect(AuthController.me).toHaveBeenCalledWith({
        headers: { Cookie: 'ghosty_session=1; ghosty_token=abc' },
      })
      expect(store.user.value).toEqual(user)
    })

    it('leaves the store anonymous when the API rejects the cookie as unauthorized', async () => {
      const store = createAuthStore()
      vi.spyOn(AuthController, 'me').mockResolvedValue(
        controllerError(STATUS.UNAUTHORIZED, 'unauthorized'),
      )

      const result = await authFunctions.restoreSession(store, 'ghosty_session=1')

      expect(result.status).toBe(STATUS.UNAUTHORIZED)
      expect(store.isAuthenticated.value).toBe(false)
    })

    it('reports the server status when the API is unreachable', async () => {
      const store = createAuthStore()
      vi.spyOn(AuthController, 'me').mockResolvedValue(
        controllerError(STATUS.ERROR_SERVER, 'error_server'),
      )

      const result = await authFunctions.restoreSession(store, 'ghosty_session=1')

      expect(result.status).toBe(STATUS.ERROR_SERVER)
      expect(store.isAuthenticated.value).toBe(false)
    })
  })
})
