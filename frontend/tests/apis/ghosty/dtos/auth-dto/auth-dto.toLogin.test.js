import { describe, it, expect } from 'vitest'
import { AuthDto } from '@/apis/ghosty/dtos/auth-dto.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('auth-dto', () => {
  describe('toLogin', () => {
    it('keeps only email and password', () => {
      const form = userSeeder.getLoginForm({ remember: true })

      const payload = AuthDto.toLogin(form)

      expect(payload).toEqual({ identifier: form.identifier, password: form.password })
    })
  })
})
