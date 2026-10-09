import { describe, it, expect, vi, afterEach } from 'vitest'
import { AuthController } from '@/apis/ghosty/controllers/auth-controller.js'
import { AuthRepository } from '@/apis/ghosty/repositories/auth-repository.js'
import { STATUS } from '@/constants/ajax-constants.js'

describe('auth-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('logout', () => {
    it('returns the message on success', async () => {
      vi.spyOn(AuthRepository, 'logout').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: { message: 'bye' },
      })

      const result = await AuthController.logout()

      expect(result).toEqual({ status: STATUS.SUCCESS, message: 'bye' })
    })

    it('passes the error response through on failure', async () => {
      const failure = { status: STATUS.UNAUTHORIZED, error: 'nope' }
      vi.spyOn(AuthRepository, 'logout').mockResolvedValue(failure)

      expect(await AuthController.logout()).toBe(failure)
    })
  })
})
