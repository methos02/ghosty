import { describe, it, expect } from 'vitest'
import { createProfileStore } from '@/core-vue/stores/users/profile-store.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('profile-store', () => {
  describe('clear', () => {
    it('forgets the profile on leaving the page', () => {
      const store = createProfileStore()
      store.setProfile(userSeeder.getProfile())

      store.clear()

      expect(store.profile.value).toBeUndefined()
    })
  })
})
