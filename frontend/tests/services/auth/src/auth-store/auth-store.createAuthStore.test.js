import { describe, it, expect } from 'vitest'
import { createAuthStore } from '@/services/auth/src/auth-store.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('auth-store', () => {
  describe('createAuthStore', () => {
    it('isolates each instance so a request never leaks into another', () => {
      const firstStore = createAuthStore()
      const secondStore = createAuthStore()

      firstStore.setUser(userSeeder.getUser())

      expect(secondStore.isAuthenticated.value).toBe(false)
    })
  })
})
