import { describe, it, expect, afterEach } from 'vitest'
import { readingSettingsHelper } from '@/core/helpers/reading-settings-helper.js'
import { ConfigLoader } from '@/config/config-loader.js'

describe('reading-settings-helper', () => {
  afterEach(() => {
    localStorage.clear()
  })

  describe('sanitize', () => {
    it('keeps a reading comfort the reader can actually have chosen', () => {
      const sanitized = readingSettingsHelper.sanitize({
        width: 60,
        fontSize: 24,
        fontFamily: 'open-dyslexic',
        nightMode: true,
      })

      expect(sanitized).toEqual({
        width: 60,
        fontSize: 24,
        fontFamily: 'open-dyslexic',
        nightMode: true,
      })
    })

    it('pulls a width back inside the range the panel offers', () => {
      const sanitized = readingSettingsHelper.sanitize({ width: 400 })

      expect(sanitized.width).toBe(ConfigLoader.get('reading.width.max'))
    })

    it('falls back on the default font when the stored one no longer exists', () => {
      const sanitized = readingSettingsHelper.sanitize({ fontFamily: 'comic-sans' })

      expect(sanitized.fontFamily).toBe(ConfigLoader.get('reading.fontFamily.default'))
    })
  })
})
