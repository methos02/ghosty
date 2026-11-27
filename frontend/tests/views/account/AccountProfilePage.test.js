import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AccountProfilePage from '@/views/account/AccountProfilePage.vue'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('AccountProfilePage.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    useAuthStore().clear()
    vi.clearAllMocks()
  })

  it('gathers the avatar, profile and notifications sections, without the security ones', () => {
    useAuthStore().setUser(userSeeder.getUser())

    wrapper = mount(AccountProfilePage)

    expect(
      [
        '.account-avatar-section',
        '.account-profile-section',
        '.account-notifications-section',
        '.account-email-section',
        '.account-password-section',
        '.account-deletion-section',
      ].map(selector => wrapper.find(selector).exists()),
    ).toEqual([true, true, true, false, false, false])
  })
})
