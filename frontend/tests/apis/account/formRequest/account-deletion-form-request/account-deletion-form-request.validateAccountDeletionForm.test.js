import { describe, it, expect, afterEach } from 'vitest'
import { validateAccountDeletionForm } from '@/apis/account/formRequest/account-deletion-form-request.js'
import { form } from '@/services/shortcuts/services-shortcut.js'
import { accountSeeder } from '&/utils/seeders/account-seeder.js'

describe('account-deletion-form-request', () => {
  afterEach(() => {
    form.clearErrors()
  })

  describe('validateAccountDeletionForm', () => {
    it('accepts the deletion confirmed by the current password', () => {
      expect(validateAccountDeletionForm(accountSeeder.getDeletionForm()).valid).toBe(true)
    })

    it('refuses the deletion without the current password', () => {
      validateAccountDeletionForm(accountSeeder.getDeletionForm({ currentPassword: '' }))

      expect(form.getError('accountDeletion.currentPassword')).toBe(
        'common.error_current_password_required',
      )
    })
  })
})
