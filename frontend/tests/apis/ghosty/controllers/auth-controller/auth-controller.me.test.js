import { describe, it, expect, vi, afterEach } from 'vitest'
import { AuthController } from '@/apis/ghosty/controllers/auth-controller.js'
import { AuthRepository } from '@/apis/ghosty/repositories/auth-repository.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('auth-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('me', () => {
    it('returns the mapped user on success', async () => {
      vi.spyOn(AuthRepository, 'me').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: { user: userSeeder.getUserApi() },
      })

      const result = await AuthController.me()

      expect(result.status).toBe(STATUS.SUCCESS)
      expect(result.user.email).toBe('ghost@ghosty.test')
    })

    it('passes the error response through on failure', async () => {
      const failure = { status: STATUS.UNAUTHORIZED, error: 'nope' }
      vi.spyOn(AuthRepository, 'me').mockResolvedValue(failure)

      expect(await AuthController.me()).toBe(failure)
    })
  })
})
