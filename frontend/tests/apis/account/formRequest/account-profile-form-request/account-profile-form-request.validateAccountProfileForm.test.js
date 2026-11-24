import { describe, it, expect, afterEach } from 'vitest'
import { validateAccountProfileForm } from '@/apis/account/formRequest/account-profile-form-request.js'
import { form } from '@/services/shortcuts/services-shortcut.js'
import { accountSeeder } from '&/utils/seeders/account-seeder.js'

describe('account-profile-form-request', () => {
  afterEach(() => {
    form.clearErrors()
  })

  describe('validateAccountProfileForm', () => {
    it('accepts a complete profile', () => {
      expect(validateAccountProfileForm(accountSeeder.getProfileForm()).valid).toBe(true)
    })

    it('refuses an empty username', () => {
      validateAccountProfileForm(accountSeeder.getProfileForm({ username: '  ' }))

      expect(form.getError('accountProfile.username')).toBe(
        'account_profile_section.error_username_required',
      )
    })

    it('refuses a username shorter than three characters', () => {
      validateAccountProfileForm(accountSeeder.getProfileForm({ username: 'ab' }))

      expect(form.getError('accountProfile.username')).toBe(
        'account_profile_section.error_username_size_min',
      )
    })

    it('refuses a username longer than fifty characters', () => {
      validateAccountProfileForm(accountSeeder.getProfileForm({ username: 'a'.repeat(51) }))

      expect(form.getError('accountProfile.username')).toBe(
        'account_profile_section.error_username_size_max',
      )
    })
  })
})
