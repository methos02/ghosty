import { describe, it, expect, afterEach } from 'vitest'
import { validateAccountEmailForm } from '@/apis/account/formRequest/account-email-form-request.js'
import { form } from '@/services/shortcuts/services-shortcut.js'
import { accountSeeder } from '&/utils/seeders/account-seeder.js'

describe('account-email-form-request', () => {
  afterEach(() => {
    form.clearErrors()
  })

  describe('validateAccountEmailForm', () => {
    it('accepts an address confirmed by the current password', () => {
      expect(validateAccountEmailForm(accountSeeder.getEmailForm()).valid).toBe(true)
    })

    it('refuses a malformed address', () => {
      validateAccountEmailForm(accountSeeder.getEmailForm({ email: 'plume' }))

      expect(form.getError('accountEmail.email')).toBe('account_email_section.error_email_invalid')
    })

    it('refuses the change without the current password', () => {
      validateAccountEmailForm(accountSeeder.getEmailForm({ currentPassword: '' }))

      expect(form.getError('accountEmail.currentPassword')).toBe(
        'common.error_current_password_required',
      )
    })
  })
})
