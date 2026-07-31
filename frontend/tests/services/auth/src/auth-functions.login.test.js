import { describe, it, expect, vi, afterEach } from 'vitest'
import { AuthController } from '@/apis/ghosty/controllers/auth-controller.js'
import { authFunctions } from '@/services/auth/src/auth-functions.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { controllerError, controllerSuccess } from '&/utils/helpers/controller-response.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('auth-functions', () => {
  afterEach(() => {
    useAuthStore().clear()
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('stores the user without persisting any credential in localStorage', async () => {
      const user = userSeeder.getUser()
      vi.spyOn(AuthController, 'login').mockResolvedValue(controllerSuccess({ user }))

      const result = await authFunctions.login(userSeeder.getLoginForm())

      expect(result).toEqual({ status: STATUS.SUCCESS, user })
      expect(useAuthStore().user.value).toEqual(user)
      expect(Object.keys(localStorage)).toEqual(['locale'])
    })

    it('leaves the store empty when the credentials are refused', async () => {
      vi.spyOn(AuthController, 'login').mockResolvedValue(
        controllerError(STATUS.UNPROCESSABLE_ENTITY, 'invalid_credentials'),
      )

      const result = await authFunctions.login(userSeeder.getLoginForm())

      expect(result).toEqual({ status: STATUS.ERROR, error: 'invalid_credentials' })
      expect(useAuthStore().isAuthenticated.value).toBe(false)
    })
  })
})
