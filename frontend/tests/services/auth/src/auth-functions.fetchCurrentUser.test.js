import { describe, it, expect, vi, afterEach } from 'vitest'
import { AuthController } from '@/apis/ghosty/controllers/auth-controller.js'
import { authFunctions } from '@/services/auth/src/auth-functions.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { controllerError, controllerSuccess } from '&/utils/helpers/controller-response.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('auth-functions', () => {
  afterEach(() => {
    document.cookie = 'ghosty_session=; max-age=0'
    useAuthStore().clear()
    vi.clearAllMocks()
  })

  describe('fetchCurrentUser', () => {
    it('does not call the API when the session cookie is absent', async () => {
      const me = vi.spyOn(AuthController, 'me')

      await authFunctions.fetchCurrentUser()

      expect(me).not.toHaveBeenCalled()
      expect(useAuthStore().isAuthenticated.value).toBe(false)
    })

    it('restores the user when the session cookie is present', async () => {
      document.cookie = 'ghosty_session=1'
      const user = userSeeder.getUser()
      vi.spyOn(AuthController, 'me').mockResolvedValue(controllerSuccess({ user }))

      await authFunctions.fetchCurrentUser()

      expect(useAuthStore().user.value).toEqual(user)
    })

    it('clears the store when the API rejects the cookie as unauthorized', async () => {
      document.cookie = 'ghosty_session=1'
      useAuthStore().setUser(userSeeder.getUser())
      vi.spyOn(AuthController, 'me').mockResolvedValue(
        controllerError(STATUS.UNAUTHORIZED, 'unauthorized'),
      )

      await authFunctions.fetchCurrentUser()

      expect(useAuthStore().isAuthenticated.value).toBe(false)
    })
  })
})
