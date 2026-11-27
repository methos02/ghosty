import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AccountSecurityPage from '@/views/account/AccountSecurityPage.vue'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('AccountSecurityPage.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    useAuthStore().clear()
    vi.clearAllMocks()
  })

  it('gathers the email, password and deletion sections, without the profile ones', () => {
    useAuthStore().setUser(userSeeder.getUser())

    wrapper = mount(AccountSecurityPage)

    expect(
      [
        '.account-email-section',
        '.account-password-section',
        '.account-deletion-section',
        '.account-avatar-section',
        '.account-profile-section',
      ].map(selector => wrapper.find(selector).exists()),
    ).toEqual([true, true, true, false, false])
  })
})
