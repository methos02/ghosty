import { describe, it, expect, afterEach } from 'vitest'
import { validateCoverCropForm } from '@/apis/covers/formRequest/cover-crop-form-request.js'
import { form } from '@/services/shortcuts/services-shortcut.js'

describe('cover-crop-form-request', () => {
  afterEach(() => {
    form.clearErrors()
  })

  describe('validateCoverCropForm', () => {
    it('accepts an image wide enough once cropped in 16/9', () => {
      expect(validateCoverCropForm({ width: 800, height: 450 }).valid).toBe(true)
    })

    it('refuses a file the browser could not read as an image', () => {
      const validation = validateCoverCropForm({ width: 0, height: 0 })

      expect(validation.valid).toBe(false)
      expect(form.getError('cover.image')).toBe('cover_image_field.error_unreadable')
    })

    it('refuses an image narrower than the minimum width', () => {
      validateCoverCropForm({ width: 799, height: 450 })

      expect(form.getError('cover.image')).toBe('cover_image_field.error_too_small')
    })

    it('refuses a wide image too short to give the minimum width in 16/9', () => {
      validateCoverCropForm({ width: 1600, height: 400 })

      expect(form.getError('cover.image')).toBe('cover_image_field.error_too_small')
    })
  })
})
