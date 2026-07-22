import { describe, it, expect, vi, afterEach } from 'vitest'
import { AuthErrorDto } from '@/apis/ghosty/dtos/auth-error-dto.js'
import { form } from '@/services/shortcuts/services-shortcut.js'

describe('auth-error-dto', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('registerFields', () => {
    it('maps API error keys to register form field names', () => {
      const mapFields = vi
        .spyOn(form, 'mapFields')
        .mockReturnValue({ 'register.email': ['invalid'] })
      const validationErrors = { email: ['invalid'], password_confirmation: ['mismatch'] }

      const result = AuthErrorDto.registerFields(validationErrors)

      expect(mapFields).toHaveBeenCalledWith(validationErrors, {
        pseudo: 'register.pseudo',
        email: 'register.email',
        password: 'register.password',
        password_confirmation: 'register.passwordConfirmation',
      })
      expect(result).toEqual({ 'register.email': ['invalid'] })
    })
  })

  describe('loginFields', () => {
    it('maps API error keys to login form field names', () => {
      const mapFields = vi.spyOn(form, 'mapFields').mockReturnValue({})
      const validationErrors = { email: ['required'] }

      AuthErrorDto.loginFields(validationErrors)

      expect(mapFields).toHaveBeenCalledWith(validationErrors, {
        email: 'login.email',
        password: 'login.password',
      })
    })
  })
})
