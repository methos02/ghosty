import { describe, it, expect, vi, afterEach } from 'vitest'
import { AuthController } from '@/apis/ghosty/controllers/auth-controller.js'
import { AuthRepository } from '@/apis/ghosty/repositories/auth-repository.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { form } from '@/services/shortcuts/services-shortcut.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('auth-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('sends the mapped credentials and returns the user on success', async () => {
      const user = userSeeder.getUserApi()
      vi.spyOn(AuthRepository, 'login').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: { user },
      })

      const result = await AuthController.login(userSeeder.getLoginForm())

      expect(AuthRepository.login).toHaveBeenCalledWith({
        identifier: 'ghost@ghosty.test',
        password: 'Secret123!',
      })
      expect(result.user.id).toBe(42)
    })

    it('registers validation errors on 422 and returns an error status', async () => {
      vi.spyOn(AuthRepository, 'login').mockResolvedValue({
        status: STATUS.UNPROCESSABLE_ENTITY,
        data: { errors: { identifier: ['invalid'] } },
      })
      const addValidationErrors = vi.spyOn(form, 'addValidationErrors').mockImplementation(() => {})

      const result = await AuthController.login(userSeeder.getLoginForm())

      expect(addValidationErrors).toHaveBeenCalledWith({ identifier: ['invalid'] }, 'login')
      expect(result.status).toBe(STATUS.UNPROCESSABLE_ENTITY)
    })
  })
})
