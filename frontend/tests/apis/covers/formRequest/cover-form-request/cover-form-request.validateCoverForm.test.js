import { describe, it, expect, afterEach } from 'vitest'
import { validateCoverForm } from '@/apis/covers/formRequest/cover-form-request.js'
import { form } from '@/services/shortcuts/services-shortcut.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'

describe('cover-form-request', () => {
  afterEach(() => {
    form.clearErrors()
  })

  describe('validateCoverForm', () => {
    it('accepts the form once an image is ready', () => {
      expect(validateCoverForm(coverSeeder.getCreateForm()).valid).toBe(true)
    })

    it('refuses the form when no image was chosen', () => {
      const validation = validateCoverForm({})

      expect(validation.valid).toBe(false)
      expect(form.getError('cover.image')).toBe('cover_propose_dialog.error_image_required')
    })
  })
})
