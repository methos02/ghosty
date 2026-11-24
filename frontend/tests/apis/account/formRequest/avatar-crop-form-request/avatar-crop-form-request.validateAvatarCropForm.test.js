import { describe, it, expect, afterEach } from 'vitest'
import { validateAvatarCropForm } from '@/apis/account/formRequest/avatar-crop-form-request.js'
import { form } from '@/services/shortcuts/services-shortcut.js'

describe('avatar-crop-form-request', () => {
  afterEach(() => {
    form.clearErrors()
  })

  describe('validateAvatarCropForm', () => {
    it('accepts an image giving the minimum side once cropped in a square', () => {
      expect(validateAvatarCropForm({ width: 400, height: 200 }).valid).toBe(true)
    })

    it('refuses a file the browser could not read as an image', () => {
      validateAvatarCropForm({ width: 0, height: 0 })

      expect(form.getError('accountProfile.image')).toBe('account_avatar_section.error_unreadable')
    })

    it('refuses an image too short to give the minimum side in a square', () => {
      validateAvatarCropForm({ width: 1000, height: 199 })

      expect(form.getError('accountProfile.image')).toBe('account_avatar_section.error_too_small')
    })
  })
})
