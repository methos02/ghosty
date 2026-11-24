import { describe, it, expect } from 'vitest'
import { createProfileStore } from '@/core-vue/stores/users/profile-store.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('profile-store', () => {
  describe('createProfileStore', () => {
    it('creates isolated stores per call (request-scoped)', () => {
      const storeA = createProfileStore()
      const storeB = createProfileStore()

      storeA.setProfile(userSeeder.getProfile())

      expect(storeB.profile.value).toBeUndefined()
    })
  })
})
