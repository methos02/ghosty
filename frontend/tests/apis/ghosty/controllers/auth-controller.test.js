import { describe, it, expect, vi, afterEach } from 'vitest'
import { AuthController } from '@/apis/ghosty/controllers/auth-controller.js'
import { AuthRepository } from '@/apis/ghosty/repositories/auth-repository.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { form } from '@/services/shortcuts/services-shortcut.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('auth-controller', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('register', () => {
    it('sends the mapped payload and returns user + token on success', async () => {
      const user = userSeeder.getUserApi()
      vi.spyOn(AuthRepository, 'register').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: { user, token: 'jwt-token' },
      })

      const result = await AuthController.register(userSeeder.getRegisterForm())

      expect(AuthRepository.register).toHaveBeenCalledWith({
        pseudo: 'GhostWriter',
        email: 'ghost@ghosty.test',
        password: 'Secret123!',
        password_confirmation: 'Secret123!',
      })
      expect(result.status).toBe(STATUS.SUCCESS)
      expect(result.user.pseudo).toBe('GhostWriter')
      expect(result.token).toBe('jwt-token')
    })

    it('registers validation errors on 422 and returns an error status', async () => {
      vi.spyOn(AuthRepository, 'register').mockResolvedValue({
        status: STATUS.UNPROCESSABLE_ENTITY,
        data: { errors: { email: ['taken'] } },
      })
      const mapFields = vi.spyOn(form, 'mapFields').mockReturnValue({ 'register.email': ['taken'] })
      const addErrors = vi.spyOn(form, 'addErrors').mockImplementation(() => {})

      const result = await AuthController.register(userSeeder.getRegisterForm())

      expect(mapFields).toHaveBeenCalled()
      expect(addErrors).toHaveBeenCalledWith({ 'register.email': ['taken'] })
      expect(result).toEqual({ status: STATUS.ERROR })
    })

    it('passes other error responses through', async () => {
      const failure = { status: STATUS.ERROR_SERVER, error: 'boom' }
      vi.spyOn(AuthRepository, 'register').mockResolvedValue(failure)

      expect(await AuthController.register(userSeeder.getRegisterForm())).toBe(failure)
    })
  })

  describe('login', () => {
    it('sends the mapped credentials and returns user + token on success', async () => {
      const user = userSeeder.getUserApi()
      vi.spyOn(AuthRepository, 'login').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: { user, token: 'jwt-token' },
      })

      const result = await AuthController.login(userSeeder.getLoginForm())

      expect(AuthRepository.login).toHaveBeenCalledWith({
        email: 'ghost@ghosty.test',
        password: 'Secret123!',
      })
      expect(result.user.id).toBe(42)
      expect(result.token).toBe('jwt-token')
    })

    it('registers validation errors on 422 and returns an error status', async () => {
      vi.spyOn(AuthRepository, 'login').mockResolvedValue({
        status: STATUS.UNPROCESSABLE_ENTITY,
        data: { errors: { email: ['invalid'] } },
      })
      vi.spyOn(form, 'mapFields').mockReturnValue({ 'login.email': ['invalid'] })
      const addErrors = vi.spyOn(form, 'addErrors').mockImplementation(() => {})

      const result = await AuthController.login(userSeeder.getLoginForm())

      expect(addErrors).toHaveBeenCalledWith({ 'login.email': ['invalid'] })
      expect(result).toEqual({ status: STATUS.ERROR })
    })
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
