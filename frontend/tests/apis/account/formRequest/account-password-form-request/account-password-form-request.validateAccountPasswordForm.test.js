import { describe, it, expect, afterEach } from 'vitest'
import { validateAccountPasswordForm } from '@/apis/account/formRequest/account-password-form-request.js'
import { form } from '@/services/shortcuts/services-shortcut.js'
import { accountSeeder } from '&/utils/seeders/account-seeder.js'

describe('account-password-form-request', () => {
  afterEach(() => {
    form.clearErrors()
  })

  describe('validateAccountPasswordForm', () => {
    it('accepts a confirmed new password of eight characters or more', () => {
      expect(validateAccountPasswordForm(accountSeeder.getPasswordForm()).valid).toBe(true)
    })

    it('refuses the change without the current password', () => {
      validateAccountPasswordForm(accountSeeder.getPasswordForm({ currentPassword: '' }))

      expect(form.getError('accountPassword.currentPassword')).toBe(
        'common.error_current_password_required',
      )
    })

    it('refuses a new password shorter than eight characters', () => {
      validateAccountPasswordForm(
        accountSeeder.getPasswordForm({
          password: 'court',
          passwordConfirmation: 'court',
        }),
      )

      expect(form.getError('accountPassword.password')).toBe(
        'account_password_section.error_password_size_min',
      )
    })

    it('refuses a confirmation that differs from the new password', () => {
      validateAccountPasswordForm(
        accountSeeder.getPasswordForm({ passwordConfirmation: 'AutreChose789!' }),
      )

      expect(form.getError('accountPassword.passwordConfirmation')).toBe(
        'account_password_section.error_password_confirmation_match',
      )
    })
  })
})
