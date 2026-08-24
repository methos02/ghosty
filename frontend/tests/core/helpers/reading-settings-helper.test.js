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

  describe('read', () => {
    it('returns the defaults when the reader has never set anything', () => {
      expect(readingSettingsHelper.read()).toEqual(readingSettingsHelper.defaults())
    })

    it('returns what the reader saved on a previous visit', () => {
      readingSettingsHelper.write({
        width: 60,
        fontSize: 24,
        fontFamily: 'lato',
        nightMode: true,
      })

      expect(readingSettingsHelper.read().fontFamily).toBe('lato')
    })

    it('falls back on the defaults when the stored settings are unreadable', () => {
      localStorage.setItem(ConfigLoader.get('reading.storageKey'), '{ not json')

      expect(readingSettingsHelper.read()).toEqual(readingSettingsHelper.defaults())
    })
  })

  describe('textStyle', () => {
    it('measures the text against the window, with a floor for the small screens', () => {
      const floor = ConfigLoader.get('reading.width.minPixels')

      const style = readingSettingsHelper.textStyle({ width: 60, fontSize: 24 })

      expect(style).toEqual({ maxWidth: `max(60vw, ${floor}px)`, fontSize: '24px' })
    })
  })

  describe('fontSizes', () => {
    it('offers every size between the bounds, by step', () => {
      const range = ConfigLoader.get('reading.fontSize')
      const sizes = readingSettingsHelper.fontSizes()

      expect(sizes.at(0)).toBe(range.min)
      expect(sizes.at(-1)).toBe(range.max)
      expect(sizes[1] - sizes[0]).toBe(range.step)
    })
  })
})
