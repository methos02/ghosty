import { describe, it, expect } from 'vitest'
import { createAuthStore } from '@/services/auth/src/auth-store.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('auth-store', () => {
  describe('setUser', () => {
    it('derives the role flags from the hydrated user', () => {
      const store = createAuthStore()

      store.setUser(userSeeder.getUser({ roles: ['author', 'moderator'] }))

      expect(store.isAuthor.value).toBe(true)
      expect(store.isModerator.value).toBe(true)
      expect(store.isAdmin.value).toBe(false)
    })
  })
})
