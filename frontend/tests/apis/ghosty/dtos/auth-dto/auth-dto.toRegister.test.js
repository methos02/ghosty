import { describe, it, expect } from 'vitest'
import { AuthDto } from '@/apis/ghosty/dtos/auth-dto.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('auth-dto', () => {
  describe('toRegister', () => {
    it('maps the register form to the API payload (snake_case confirmation)', () => {
      const form = userSeeder.getRegisterForm()

      const payload = AuthDto.toRegister(form)

      expect(payload).toEqual({
        username: form.username,
        email: form.email,
        password: form.password,
        password_confirmation: form.passwordConfirmation,
      })
    })
  })
})
