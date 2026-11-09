import { describe, it, expect, vi, afterEach } from 'vitest'
import { AuthController } from '@/apis/ghosty/controllers/auth-controller.js'
import { AuthRepository } from '@/apis/ghosty/repositories/auth-repository.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('auth-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('register', () => {
    it('sends the mapped payload and returns the user on success', async () => {
      const user = userSeeder.getUserApi()
      vi.spyOn(AuthRepository, 'register').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: { user },
      })

      const result = await AuthController.register(userSeeder.getRegisterForm())

      expect(AuthRepository.register).toHaveBeenCalledWith({
        body: {
          username: 'GhostWriter',
          email: 'ghost@ghosty.test',
          password: 'Secret123!',
          password_confirmation: 'Secret123!',
        },
        form: 'register',
      })
      expect(result.status).toBe(STATUS.SUCCESS)
      expect(result.user.username).toBe('GhostWriter')
    })

    it('passes other error responses through', async () => {
      const failure = { status: STATUS.ERROR_SERVER, error: 'boom' }
      vi.spyOn(AuthRepository, 'register').mockResolvedValue(failure)

      expect(await AuthController.register(userSeeder.getRegisterForm())).toBe(failure)
    })
  })
})
