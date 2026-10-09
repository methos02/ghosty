import { describe, it, expect } from 'vitest'
import { createAuthStore } from '@/services/auth/src/auth-store.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('auth-store', () => {
  describe('hydrate', () => {
    it('transfers the user from a serialized snapshot to another store', () => {
      const serverStore = createAuthStore()
      const clientStore = createAuthStore()
      const user = userSeeder.getUser()

      serverStore.setUser(user)
      clientStore.hydrate(serverStore.serialize())

      expect(clientStore.user.value).toEqual(user)
    })
  })
})
