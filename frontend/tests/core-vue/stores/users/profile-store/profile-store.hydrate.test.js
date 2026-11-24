import { describe, it, expect } from 'vitest'
import { createProfileStore } from '@/core-vue/stores/users/profile-store.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('profile-store', () => {
  describe('hydrate', () => {
    it('restores the profile the server rendered', () => {
      const store = createProfileStore()
      const snapshot = { profile: userSeeder.getProfile() }

      store.hydrate(snapshot)

      expect(store.serialize()).toEqual(snapshot)
    })
  })
})
