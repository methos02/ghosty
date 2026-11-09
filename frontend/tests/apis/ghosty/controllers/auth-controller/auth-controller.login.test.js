import { describe, it, expect, vi, afterEach } from 'vitest'
import { AuthController } from '@/apis/ghosty/controllers/auth-controller.js'
import { AuthRepository } from '@/apis/ghosty/repositories/auth-repository.js'
import { STATUS } from '@/constants/ajax-constants.js'
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
        body: {
          identifier: 'ghost@ghosty.test',
          password: 'Secret123!',
        },
        form: 'login',
      })
      expect(result.user.id).toBe(42)
    })
  })
})
